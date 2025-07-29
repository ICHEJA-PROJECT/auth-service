import { HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import {
  PersonaRepositoryI,
  RolRepositoryI,
  EncryptDataRepository,
} from '../domain/repositories';
import {
  PersonaRepositoryImp,
  RolRepositoryImp,
  EncryptDataRepositoryImp,
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
import { PersonaI, PersonaRolI, TokenPayloadI } from '../domain/entitiesI';
import { catchError, firstValueFrom } from 'rxjs';
import { PREFERENCES_SERVICE_OPTIONS } from 'src/preferences/domain/constants/preferences_service_options';

// Constants
const ERROR_MESSAGES = {
  INVALID_CREDENTIALS: 'Invalid credentials',
  USER_NOT_FOUND: 'User not found',
  USER_ROLE_NOT_FOUND: 'User role not found',
  LOGIN_FAILED: 'Login failed',
  INVALID_QR_TOKEN: 'Invalid QR token',
  TOKEN_VALIDATION_FAILED: 'Token validation failed',
  INVALID_TOKEN_FORMAT: 'Invalid token format',
  TOKEN_EXPIRED: 'Token is expired',
  INVALID_TOKEN: 'Invalid token',
  TOKEN_VALID: 'Token is valid',
  IMPAIRMENT_SERVICE_ERROR: 'Error en la petición AMPQ a findByStudent',
} as const;

const DEFAULT_VALUES = {
  DISABILITY_NAME: 'Sin discapacidad',
  DISABILITY_ID: 0,
  LEARNING_PATH_ID: 2,
} as const;

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
    @Inject(PREFERENCES_SERVICE_OPTIONS.PREFERENCES_SERVICE_NAME)
    private readonly client: ClientProxy,
  ) {}

  async loginWithCredentials(
    loginDto: LoginCredentialsDto,
  ): Promise<LoginResponseAdapter> {
    try {
      this.logger.debug(
        `Attempting login with credentials for CURP: ${loginDto.curp}`,
      );

      const persona = await this.validateCredentials(loginDto);
      const loginResponse = await this.generateLoginResponse(persona);

      this.logger.log(
        `User ${persona.curp} logged in successfully with credentials.`,
      );

      return loginResponse;
    } catch (error) {
      this.logger.error('Login with credentials failed', error.stack);
      this.handleAuthError(error, ERROR_MESSAGES.LOGIN_FAILED);
    }
  }

  async loginWithQR(loginDto: LoginQrDto): Promise<LoginResponseAdapter> {
    try {
      this.logger.debug('Attempting login with QR token');

      const persona = await this.validateQRToken(loginDto.encryptedToken);
      const loginResponse = await this.generateLoginResponse(persona);

      this.logger.log(`User ${persona.curp} logged in successfully with QR.`);

      return loginResponse;
    } catch (error) {
      this.logger.error('Login with QR failed', error.stack);
      this.handleAuthError(error, ERROR_MESSAGES.INVALID_QR_TOKEN);
    }
  }

  async validateToken(
    validateDto: ValidateTokenDto,
  ): Promise<ValidateTokenResponseAdapter> {
    try {
      this.logger.debug('Validating token');

      const decodedPayload = this.jwtService.decode(validateDto.token);
      if (!decodedPayload) {
        return new ValidateTokenResponseAdapter(
          false,
          false,
          null,
          ERROR_MESSAGES.INVALID_TOKEN_FORMAT,
        );
      }

      try {
        const verifiedPayload: TokenPayloadI = this.jwtService.verify(
          validateDto.token,
        );

        this.logger.log(
          `Token validated successfully for user ${verifiedPayload.nombre}`,
        );

        return new ValidateTokenResponseAdapter(
          true,
          false,
          verifiedPayload,
          ERROR_MESSAGES.TOKEN_VALID,
        );
      } catch (verificationError) {
        if (verificationError.name === 'TokenExpiredError') {
          return new ValidateTokenResponseAdapter(
            false,
            true,
            decodedPayload,
            ERROR_MESSAGES.TOKEN_EXPIRED,
          );
        }

        return new ValidateTokenResponseAdapter(
          false,
          false,
          null,
          ERROR_MESSAGES.INVALID_TOKEN,
        );
      }
    } catch (error) {
      this.logger.error('Token validation failed', error.stack);
      return new ValidateTokenResponseAdapter(
        false,
        false,
        null,
        ERROR_MESSAGES.TOKEN_VALIDATION_FAILED,
      );
    }
  }

  private async validateCredentials(loginDto: LoginCredentialsDto) {
    const persona = await this.personaRepository.findByCurp(loginDto.curp);
    if (!persona) {
      throw new RpcException({
        status: HttpStatus.UNAUTHORIZED,
        message: ERROR_MESSAGES.INVALID_CREDENTIALS,
      });
    }

    const isValidPassword = await this.personaRepository.validatePassword(
      persona,
      loginDto.password,
    );
    if (!isValidPassword) {
      throw new RpcException({
        status: HttpStatus.UNAUTHORIZED,
        message: ERROR_MESSAGES.INVALID_CREDENTIALS,
      });
    }

    return persona;
  }

  private async validateQRToken(encryptedToken: string) {
    const decryptedToken = this.encryptDataRepository.decrypt(encryptedToken);
    this.logger.debug('QR token decrypted successfully');

    const decodedPayload = this.jwtService.decode(decryptedToken);
    this.logger.debug('QR token decoded successfully');

    const persona = await this.personaRepository.findById(decodedPayload.id);
    if (!persona) {
      throw new RpcException({
        status: HttpStatus.UNAUTHORIZED,
        message: ERROR_MESSAGES.USER_NOT_FOUND,
      });
    }

    return persona;
  }

  private async generateLoginResponse(
    persona: PersonaI,
  ): Promise<LoginResponseAdapter> {
    const [personaRol, impairmentInfo] = await Promise.all([
      this.getUserRole(persona.id_persona),
      this.getImpairmentInfo(persona.id_persona),
    ]);

    const payload = this.createTokenPayload(
      persona,
      personaRol,
      impairmentInfo,
    );
    const token = this.jwtService.sign(payload);

    return new LoginResponseAdapter(token, payload);
  }

  private async getUserRole(personaId: number) {
    const personaRol = await this.rolRepository.findByPersonaId(personaId);
    if (!personaRol) {
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: ERROR_MESSAGES.USER_ROLE_NOT_FOUND,
      });
    }
    return personaRol;
  }

  private async getImpairmentInfo(personaId: number) {
    return firstValueFrom(
      this.client
        .send(
          {
            cmd: PREFERENCES_SERVICE_OPTIONS.STUDENT_IMPAIRMENT_FIND_BY_STUDENT_WITH_DETAILS,
          },
          { id: personaId },
        )
        .pipe(
          catchError((error) => {
            this.logger.error('Error fetching impairment info:', error);
            throw new RpcException({
              status: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
              message: error.message || ERROR_MESSAGES.IMPAIRMENT_SERVICE_ERROR,
              code: error.code || 'HTTP_ERROR',
              details: error.response?.data || error,
            });
          }),
        ),
    );
  }

  private createTokenPayload(
    persona: PersonaI,
    personaRol: PersonaRolI,
    impairmentInfo: any,
  ): TokenPayloadI {
    return {
      id_persona: persona.id_persona,
      nombre: this.formatPersonName(
        persona.primer_nombre,
        persona.segundo_nombre,
      ),
      role_name: personaRol.rol.nombre,
      disability_name:
        impairmentInfo.impairmentName || DEFAULT_VALUES.DISABILITY_NAME,
      disability_id:
        impairmentInfo.impairmentId || DEFAULT_VALUES.DISABILITY_ID,
      learning_path_id:
        impairmentInfo.learningPathId || DEFAULT_VALUES.LEARNING_PATH_ID,
    };
  }

  private formatPersonName(
    primerNombre: string,
    segundoNombre?: string,
  ): string {
    return primerNombre + (segundoNombre ? ` ${segundoNombre}` : '');
  }

  private handleAuthError(error: any, defaultMessage: string): never {
    if (error instanceof RpcException) {
      throw error;
    }
    throw new RpcException({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: defaultMessage,
    });
  }
}
