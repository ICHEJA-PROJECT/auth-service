import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponseDto {
  @ApiProperty({ example: 400 })
  statusCode: number;

  @ApiProperty({ example: 'Input data validation failed' })
  message: string;

  @ApiProperty({ example: 'VALIDATION_ERROR' })
  code: string;

  @ApiProperty({
    example: ['property a must be a string', 'property b must be a number'],
    required: false,
    isArray: true,
  })
  details?: string[];
}
