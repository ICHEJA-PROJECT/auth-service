import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, IsNotEmpty } from 'class-validator';

export class LoginCredentialsDto {
  @ApiProperty({
    description: 'CURP of the person',
    example: 'FORF040807HCSLVRA8',
    maxLength: 18,
    minLength: 18,
  })
  @IsString()
  @Length(18, 18, {
    message: 'CURP must be exactly 18 characters long',
  })
  @IsNotEmpty()
  curp: string;

  @ApiProperty({
    description: 'Password of the person',
    example: 'mySecurePassword123',
    maxLength: 32,
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
