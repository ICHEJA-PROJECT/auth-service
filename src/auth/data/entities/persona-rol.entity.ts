import { PersonaRolI } from 'src/auth/domain/entitiesI';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PersonaEntity } from './persona.entity';
import { RolEntity } from './rol.entity';

@Entity('persona_rol')
export class PersonaRolEntity implements PersonaRolI {
  @PrimaryGeneratedColumn('increment')
  id_persona_rol: number;

  @Column({ type: 'int', nullable: false })
  id_persona: number;

  @Column({ type: 'int', nullable: false })
  id_rol: number;

  @ManyToOne(() => PersonaEntity, (persona) => persona.persona_roles, {
    eager: true,
    nullable: false,
  })
  @JoinColumn({ name: 'id_persona', referencedColumnName: 'id_persona' })
  persona?: PersonaEntity;

  @ManyToOne(() => RolEntity, (rol) => rol.persona_roles, {
    eager: true,
    nullable: false,
  })
  @JoinColumn({ name: 'id_rol', referencedColumnName: 'id_rol' })
  rol?: RolEntity;
}
