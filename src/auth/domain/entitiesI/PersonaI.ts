import { GenderEnum } from '../enums/gender.enum';

export interface PersonaI {
  id_persona: number;
  primer_nombre: string;
  segundo_nombre?: string;
  apellido_paterno: string;
  apellido_materno: string;
  curp: string;
  numero_ine: string;
  fecha_nacimiento: Date;
  genero: GenderEnum;
  codigo_postal: string;
  estado: string;
  municipio: string;
  localidad: string;
  vialidad_nombre: string;
  id_vialidad_tipo: number;
  asentamiento: string;
  id_asentamiento_tipo: number;
  password: string;
}
