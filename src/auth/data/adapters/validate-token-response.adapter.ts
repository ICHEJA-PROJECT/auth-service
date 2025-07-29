import { ApiProperty } from '@nestjs/swagger';
import { TokenPayloadI } from 'src/auth/domain/entitiesI';

export class ValidateTokenResponseAdapter {
  @ApiProperty({
    description: 'Indicates if the token is valid and not expired',
    example: true,
  })
  isValid: boolean;

  @ApiProperty({
    description: 'Indicates if the token is expired',
    example: false,
  })
  isExpired: boolean;

  @ApiProperty({
    description: 'Token payload information',
    type: 'object',
    properties: {
      id_persona: {
        type: 'number',
        example: 1,
        description: 'Person ID',
      },
      username: {
        type: 'string',
        example: 'FORF040807HCSLVRA8',
        description: 'Username (CURP)',
      },
      role_name: {
        type: 'string',
        example: 'Estudiante',
        description: 'Role name',
      },
      disability_name: {
        type: 'string',
        example: 'Auditiva',
        description: 'Disability name',
        nullable: true,
      },
      disability_id: {
        type: 'number',
        example: 2,
        description: 'Disability ID',
        nullable: true,
      },
      learning_path_id: {
        type: 'number',
        example: 1,
        description: 'Learning path ID',
        nullable: true,
      },
      iat: {
        type: 'number',
        example: 1639764800,
        description: 'Issued at timestamp',
      },
      exp: {
        type: 'number',
        example: 1639772000,
        description: 'Expiration timestamp',
      },
    },
    nullable: true,
  })
  payload: TokenPayloadI | null;

  @ApiProperty({
    description: 'Error message if token is invalid',
    example: 'Token is expired',
    required: false,
  })
  message?: string;

  constructor(
    isValid: boolean,
    isExpired: boolean,
    payload: TokenPayloadI | null = null,
    message?: string,
  ) {
    this.isValid = isValid;
    this.isExpired = isExpired;
    this.payload = payload;
    this.message = message;
  }
}
