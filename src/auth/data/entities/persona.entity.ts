import { PersonaI } from 'src/auth/domain/entitiesI';
import { GenderEnum } from 'src/auth/domain/enums/gender.enum';
import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { PersonaRolEntity } from './persona-rol.entity';

@Entity('persona')
export class PersonaEntity implements PersonaI {
  @PrimaryGeneratedColumn('increment')
  id_persona: number;

  @Column({ type: 'varchar', length: 32, nullable: false })
  primer_nombre: string;

  @Column({ type: 'varchar', length: 32, nullable: true })
  segundo_nombre?: string;

  @Column({ type: 'varchar', length: 32, nullable: false })
  apellido_paterno: string;

  @Column({ type: 'varchar', length: 32, nullable: false })
  apellido_materno: string;

  @Column({ type: 'varchar', length: 18, nullable: false, unique: true })
  curp: string;

  @Column({ type: 'varchar', length: 13, nullable: false })
  numero_ine: string;

  @Column({ type: 'date', nullable: false })
  fecha_nacimiento: Date;

  @Column({ type: 'enum', enum: GenderEnum, nullable: false })
  genero: GenderEnum;

  @Column({ type: 'varchar', length: 5, nullable: false })
  codigo_postal: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  estado: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  municipio: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  localidad: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  vialidad_nombre: string;

  @Column({ type: 'int', nullable: false })
  id_vialidad_tipo: number;

  @Column({ type: 'varchar', length: 100, nullable: false })
  asentamiento: string;

  @Column({ type: 'int', nullable: false })
  id_asentamiento_tipo: number;

  @Column({ type: 'varchar', length: 32, nullable: false })
  password: string;

  @OneToMany(() => PersonaRolEntity, (personaRol) => personaRol.persona)
  persona_roles?: PersonaRolEntity[];
}
