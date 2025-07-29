import { GenderEnum } from '../enums/gender.enum';

export class Persona {
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

  private constructor(
    primer_nombre: string,
    segundo_nombre: string,
    apellido_paterno: string,
    apellido_materno: string,
    curp: string,
    numero_ine: string,
    fecha_nacimiento: Date,
    genero: GenderEnum,
    codigo_postal: string,
    estado: string,
    municipio: string,
    localidad: string,
    vialidad_nombre: string,
    id_vialidad_tipo: number,
    asentamiento: string,
    id_asentamiento_tipo: number,
    password: string,
  ) {
    this.primer_nombre = primer_nombre;
    this.segundo_nombre = segundo_nombre;
    this.apellido_paterno = apellido_paterno;
    this.apellido_materno = apellido_materno;
    this.curp = curp;
    this.numero_ine = numero_ine;
    this.fecha_nacimiento = fecha_nacimiento;
    this.genero = genero;
    this.codigo_postal = codigo_postal;
    this.estado = estado;
    this.municipio = municipio;
    this.localidad = localidad;
    this.vialidad_nombre = vialidad_nombre;
    this.id_vialidad_tipo = id_vialidad_tipo;
    this.asentamiento = asentamiento;
    this.id_asentamiento_tipo = id_asentamiento_tipo;
    this.password = password;
  }

  public static create(
    primer_nombre: string,
    segundo_nombre: string,
    apellido_paterno: string,
    apellido_materno: string,
    curp: string,
    numero_ine: string,
    fecha_nacimiento: Date,
    genero: GenderEnum,
    codigo_postal: string,
    estado: string,
    municipio: string,
    localidad: string,
    vialidad_nombre: string,
    id_vialidad_tipo: number,
    asentamiento: string,
    id_asentamiento_tipo: number,
    password: string,
  ): Persona {
    return new Persona(
      primer_nombre,
      segundo_nombre,
      apellido_paterno,
      apellido_materno,
      curp,
      numero_ine,
      fecha_nacimiento,
      genero,
      codigo_postal,
      estado,
      municipio,
      localidad,
      vialidad_nombre,
      id_vialidad_tipo,
      asentamiento,
      id_asentamiento_tipo,
      password,
    );
  }

  public getFullName(): string {
    const secondName = this.segundo_nombre ? ` ${this.segundo_nombre}` : '';
    return `${this.primer_nombre}${secondName} ${this.apellido_paterno} ${this.apellido_materno}`;
  }

  public getUsername(): string {
    return this.curp;
  }
}
