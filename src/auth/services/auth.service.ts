import { HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RpcException } from '@nestjs/microservices';
import {
  PersonaRepositoryI,
  RolRepositoryI,
  EncryptDataRepository,
  QRRepository,
} from '../domain/repositories';
import {
  PersonaRepositoryImp,
  RolRepositoryImp,
  EncryptDataRepositoryImp,
  QRRepositoryImp,
} from '../data/repositories';
import {
  LoginCredentialsDto,
  LoginQrDto,
  ValidateTokenDto,
} from '../data/dtos';
import {
  LoginResponseAdapter,
  ValidateTokenResponseAdapter,
} from '../data/adapters';
import { TokenPayloadI } from '../domain/entitiesI';
import { StudentImpairmentRepositoryImp } from 'src/disability/data/repositories';
import { StudentImpairmentRepositoryI } from 'src/disability/domain/repositories';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly jwtService: JwtService,
    @Inject(PersonaRepositoryImp)
    private readonly personaRepository: PersonaRepositoryI,
    @Inject(RolRepositoryImp)
    private readonly rolRepository: RolRepositoryI,
    @Inject(EncryptDataRepositoryImp)
    private readonly encryptDataRepository: EncryptDataRepository,
    @Inject(QRRepositoryImp)
    private readonly qrRepository: QRRepository,
    @Inject(StudentImpairmentRepositoryImp)
    private readonly studentImpairmentRepository: StudentImpairmentRepositoryI,
  ) {}

  async loginWithCredentials(
    loginDto: LoginCredentialsDto,
  ): Promise<LoginResponseAdapter> {
    try {
      // 1. Find person by CURP
      const persona = await this.personaRepository.findByCurp(loginDto.curp);
      if (!persona) {
        throw new RpcException({
          status: HttpStatus.UNAUTHORIZED,
          message: 'Invalid credentials',
        });
      }

      // 2. Validate password
      const isValidPassword = await this.personaRepository.validatePassword(
        persona,
        loginDto.password,
      );
      if (!isValidPassword) {
        throw new RpcException({
          status: HttpStatus.UNAUTHORIZED,
          message: 'Invalid credentials',
        });
      }

      // 3. Get user role
      const personaRol = await this.rolRepository.findByPersonaId(
        persona.id_persona,
      );
      if (!personaRol) {
        throw new RpcException({
          status: HttpStatus.NOT_FOUND,
          message: 'User role not found',
        });
      }

      // 4. Get disability information from external service
      const impairmentInfo =
        await this.studentImpairmentRepository.getStudentImpairmentDetails(
          persona.id_persona,
        );

      // 5. Create token payload
      const payload: TokenPayloadI = {
        id_persona: persona.id_persona,
        username: persona.curp,
        role_name: personaRol.rol.nombre,
        disability_name: impairmentInfo.impairmentName,
        disability_id: impairmentInfo.impairmentId,
        learning_path_id: impairmentInfo.learningPathId,
      };

      // 6. Generate JWT token
      const token = this.jwtService.sign(payload);

      this.logger.log(
        `User ${persona.curp} logged in successfully with credentials. Disability: ${impairmentInfo.impairmentName}, Learning Path ID: ${impairmentInfo.learningPathId}`,
      );

      return new LoginResponseAdapter(token, payload);
    } catch (error) {
      this.logger.error('Login with credentials failed', error.stack);
      if (error instanceof RpcException) {
        throw error;
      }
      throw new RpcException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Login failed',
      });
    }
  }

  async loginWithQR(loginDto: LoginQrDto): Promise<LoginResponseAdapter> {
    try {
      // 1. Decrypt the token from QR
      const decryptedToken = this.encryptDataRepository.decrypt(
        loginDto.encryptedToken,
      );

      console.log('Decrypted Token:', decryptedToken);

      // 2. Verify and decode JWT
      const decodedPayload = this.jwtService.verify(decryptedToken);

      console.log('Decoded Payload:', decodedPayload);

      // 3. Validate that the person still exists
      const persona = await this.personaRepository.findById(
        decodedPayload.id_persona,
      );
      if (!persona) {
        throw new RpcException({
          status: HttpStatus.UNAUTHORIZED,
          message: 'User not found',
        });
      }

      // 4. Get updated disability information from external service
      const impairmentInfo =
        await this.studentImpairmentRepository.getStudentImpairmentDetails(
          persona.id_persona,
        );

      // 5. Create fresh token payload with updated information
      const payload: TokenPayloadI = {
        id_persona: persona.id_persona,
        username: persona.curp,
        role_name: decodedPayload.role_name,
        disability_name: impairmentInfo.impairmentName,
        disability_id: impairmentInfo.impairmentId,
        learning_path_id: impairmentInfo.learningPathId,
      };

      // 6. Generate new JWT token
      const newToken = this.jwtService.sign(payload);

      this.logger.log(
        `User ${persona.curp} logged in successfully with QR. Disability: ${impairmentInfo.impairmentName}, Learning Path ID: ${impairmentInfo.learningPathId}`,
      );

      return new LoginResponseAdapter(newToken, payload);
    } catch (error) {
      this.logger.error('Login with QR failed', error.stack);
      if (error instanceof RpcException) {
        throw error;
      }
      throw new RpcException({
        status: HttpStatus.UNAUTHORIZED,
        message: 'Invalid QR token',
      });
    }
  }

  async validateToken(
    validateDto: ValidateTokenDto,
  ): Promise<ValidateTokenResponseAdapter> {
    try {
      // 1. Decode token without verification to check expiration
      const decodedPayload = this.jwtService.decode(validateDto.token) as any;

      if (!decodedPayload) {
        return new ValidateTokenResponseAdapter(
          false,
          false,
          null,
          'Invalid token format',
        );
      }

      // 2. Verify token (this will throw if invalid)
      let verifiedPayload: TokenPayloadI;
      try {
        verifiedPayload = this.jwtService.verify(validateDto.token);
      } catch (error) {
        if (error.name === 'TokenExpiredError') {
          return new ValidateTokenResponseAdapter(
            false,
            true,
            decodedPayload,
            'Token is expired',
          );
        }
        return new ValidateTokenResponseAdapter(
          false,
          false,
          null,
          'Invalid token',
        );
      }

      // 3. Token is valid and not expired
      this.logger.log(
        `Token validated successfully for user ${verifiedPayload.username}`,
      );

      return new ValidateTokenResponseAdapter(
        true,
        false,
        verifiedPayload,
        'Token is valid',
      );
    } catch (error) {
      this.logger.error('Token validation failed', error.stack);
      return new ValidateTokenResponseAdapter(
        false,
        false,
        null,
        'Token validation failed',
      );
    }
  }
}
