import { RolI } from 'src/auth/domain/entitiesI';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PersonaRolEntity } from './persona-rol.entity';

@Entity('rol')
export class RolEntity implements RolI {
  @PrimaryGeneratedColumn('increment')
  id_rol: number;

  @Column({ type: 'varchar', length: 64, nullable: false, unique: true })
  nombre: string;

  @OneToMany(() => PersonaRolEntity, (personaRol) => personaRol.rol)
  persona_roles?: PersonaRolEntity[];
}
