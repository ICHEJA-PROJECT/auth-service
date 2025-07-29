import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';
import {
  LoginCredentialsDto,
  LoginQrDto,
  ValidateTokenDto,
} from '../data/dtos';
import {
  LoginResponseAdapter,
  ValidateTokenResponseAdapter,
} from '../data/adapters';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AUTH_SERVICE_OPTIONS } from 'src/common/domain/constants/auth_service_options';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern({ cmd: AUTH_SERVICE_OPTIONS.AUTH_LOGIN_CREDENTIALS})
  async loginWithCredentials(
    @Payload() loginDto: LoginCredentialsDto,
  ): Promise<LoginResponseAdapter> {
    return this.authService.loginWithCredentials(loginDto);
  }

  @MessagePattern({ cmd: AUTH_SERVICE_OPTIONS.AUTH_LOGIN_STUDENT })
  async loginWithQR(
    @Payload() loginDto: LoginQrDto,
  ): Promise<LoginResponseAdapter> {
    return this.authService.loginWithQR(loginDto);
  }

  @MessagePattern({ cmd: AUTH_SERVICE_OPTIONS.AUTH_VALIDATE_TOKEN })
  async validateToken(
    @Payload() validateDto: ValidateTokenDto,
  ): Promise<ValidateTokenResponseAdapter> {
    return this.authService.validateToken(validateDto);
  }
}
