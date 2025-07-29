import { StudentImpairmentI } from '../entitiesI';

export interface StudentImpairmentRepositoryI {
  getStudentImpairmentDetails(studentId: number): Promise<StudentImpairmentI>;
}
