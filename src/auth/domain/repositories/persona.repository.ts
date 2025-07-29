import { PersonaI } from '../entitiesI';

export interface PersonaRepositoryI {
  findByCurp(curp: string): Promise<PersonaI | null>;
  findById(id_persona: number): Promise<PersonaI | null>;
  validatePassword(persona: PersonaI, password: string): Promise<boolean>;
}
