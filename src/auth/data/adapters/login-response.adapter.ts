import { ApiProperty } from '@nestjs/swagger';
import { TokenPayloadI } from 'src/auth/domain/entitiesI';

export class LoginResponseAdapter {
  @ApiProperty({
    description: 'JWT token for authentication',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZF9wZXJzb25hIjoxLCJ1c2VybmFtZSI6IkZPUkYwNDA4MDdIQ1NMVlJBOCIsInJvbGVfbmFtZSI6IkVzdHVkaWFudGUiLCJkaXNhYmlsaXR5X25hbWUiOiJBdWRpdGl2YSIsImRpc2FiaWxpdHlfaWQiOjIsImxlYXJuaW5nX3BhdGhfaWQiOjEsImlhdCI6MTYzOTc2NDgwMCwiZXhwIjoxNjM5NzcyMDAwfQ.example',
  })
  token: string;

  @ApiProperty({
    description: 'User information extracted from token',
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
    },
  })
  userInfo: TokenPayloadI;

  constructor(token: string, userInfo: TokenPayloadI) {
    this.token = token;
    this.userInfo = userInfo;
  }
}
