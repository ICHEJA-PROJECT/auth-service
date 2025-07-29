import { StudentImpairmentI } from 'src/disability/domain/entitiesI';
import { StudentImpairmentDataDto } from '../dtos';

export class StudentImpairmentAdapter {
  static fromDtoToEntity(dto: StudentImpairmentDataDto): StudentImpairmentI {
    return {
      impairmentId: dto.impairmentId,
      impairmentName: dto.impairmentName,
      learningPathId: dto.learningPathId,
    };
  }

  static fromEntityToDto(entity: StudentImpairmentI): StudentImpairmentDataDto {
    const dto = new StudentImpairmentDataDto();
    dto.impairmentId = entity.impairmentId;
    dto.impairmentName = entity.impairmentName;
    dto.learningPathId = entity.learningPathId;
    return dto;
  }
}
