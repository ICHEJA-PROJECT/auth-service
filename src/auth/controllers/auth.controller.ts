import { Controller, HttpCode, HttpStatus, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
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

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login/credentials')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Login with CURP and password',
    description: 'Authenticate user using CURP and password credentials',
  })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    type: LoginResponseAdapter,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials',
  })
  @ApiResponse({
    status: 404,
    description: 'User role not found',
  })
  async loginWithCredentials(
    @Body() loginDto: LoginCredentialsDto,
  ): Promise<LoginResponseAdapter> {
    return this.authService.loginWithCredentials(loginDto);
  }

  @Post('login/qr')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Login with QR code',
    description: 'Authenticate user using encrypted token from QR code',
  })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    type: LoginResponseAdapter,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid QR token or user not found',
  })
  async loginWithQR(
    @Body() loginDto: LoginQrDto,
  ): Promise<LoginResponseAdapter> {
    return this.authService.loginWithQR(loginDto);
  }

  @Post('validate-token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Validate JWT token',
    description:
      'Validate JWT token and extract payload information, check if expired',
  })
  @ApiResponse({
    status: 200,
    description: 'Token validation result',
    type: ValidateTokenResponseAdapter,
  })
  async validateToken(
    @Body() validateDto: ValidateTokenDto,
  ): Promise<ValidateTokenResponseAdapter> {
    return this.authService.validateToken(validateDto);
  }
}
