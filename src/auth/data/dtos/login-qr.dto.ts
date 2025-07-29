import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class LoginQrDto {
  @ApiProperty({
    description: 'Encrypted token from QR code',
    example:
      '73c39e42eceb378c88605ef9e08920c1:71a7dda1e0e099af38853088e3c99b191e44dc66fbbbc5ea2b781dcea09b403c',
  })
  @IsString()
  @IsNotEmpty()
  encryptedToken: string;
}
