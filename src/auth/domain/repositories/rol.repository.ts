import { PersonaRolI } from '../entitiesI';

export interface RolRepositoryI {
  findByPersonaId(id_persona: number): Promise<PersonaRolI | null>;
}
