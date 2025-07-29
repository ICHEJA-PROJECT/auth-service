import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RolRepositoryI } from 'src/auth/domain/repositories';
import { PersonaRolI } from 'src/auth/domain/entitiesI';
import { PersonaRolEntity } from '../entities';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class RolRepositoryImp implements RolRepositoryI {
  constructor(
    @InjectRepository(PersonaRolEntity)
    private readonly personaRolRepository: Repository<PersonaRolEntity>,
  ) {}

  async findByPersonaId(id_persona: number): Promise<PersonaRolI | null> {
    try {
      const personaRol = await this.personaRolRepository.findOne({
        where: { id_persona },
        relations: ['persona', 'rol'],
      });
      return personaRol || null;
    } catch (error) {
      throw new RpcException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      });
    }
  }
}
