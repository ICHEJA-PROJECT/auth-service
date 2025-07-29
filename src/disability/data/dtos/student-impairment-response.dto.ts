import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class StudentImpairmentDataDto {
  @ApiProperty({
    description: 'The ID of the impairment',
    example: 2,
  })
  @IsNumber()
  impairmentId: number;

  @ApiProperty({
    description: 'The name of the impairment',
    example: 'Auditiva',
  })
  @IsString()
  impairmentName: string;

  @ApiProperty({
    description: 'The ID of the learning path',
    example: 1,
  })
  @IsNumber()
  learningPathId: number;
}

export class StudentImpairmentResponseDto {
  @ApiProperty({
    description: 'Indicates if the request was successful',
    example: true,
  })
  @IsBoolean()
  success: boolean;

  @ApiProperty({
    description: 'The student impairment data',
    type: StudentImpairmentDataDto,
  })
  @ValidateNested()
  @Type(() => StudentImpairmentDataDto)
  data: StudentImpairmentDataDto;

  @ApiProperty({
    description: 'Response message',
    example: 'Request successful',
  })
  @IsString()
  message: string;
}
