import { PersonaI } from './PersonaI';
import { RolI } from './RolI';

export interface PersonaRolI {
  id_persona_rol: number;
  id_persona: number;
  id_rol: number;
  persona?: PersonaI;
  rol?: RolI;
}
