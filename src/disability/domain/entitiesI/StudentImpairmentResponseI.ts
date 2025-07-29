import { StudentImpairmentI } from './StudentImpairmentI';

export interface StudentImpairmentResponseI {
  success: boolean;
  data: StudentImpairmentI;
  message: string;
}
