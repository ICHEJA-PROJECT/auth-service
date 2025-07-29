import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PersonaRepositoryI } from 'src/auth/domain/repositories';
import { PersonaI } from 'src/auth/domain/entitiesI';
import { PersonaEntity } from '../entities';
import { RpcException } from '@nestjs/microservices';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PersonaRepositoryImp implements PersonaRepositoryI {
  constructor(
    @InjectRepository(PersonaEntity)
    private readonly personaRepository: Repository<PersonaEntity>,
  ) {}

  async findByCurp(curp: string): Promise<PersonaI | null> {
    try {
      const persona = await this.personaRepository.findOne({
        where: { curp },
      });
      return persona || null;
    } catch (error) {
      throw new RpcException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      });
    }
  }

  async findById(id_persona: number): Promise<PersonaI | null> {
    try {
      const persona = await this.personaRepository.findOne({
        where: { id_persona },
      });
      return persona || null;
    } catch (error) {
      throw new RpcException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      });
    }
  }

  async validatePassword(
    persona: PersonaI,
    password: string,
  ): Promise<boolean> {
    try {
      return await bcrypt.compare(password, persona.password);
    } catch (error) {
      throw new RpcException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Password validation failed',
      });
    }
  }
}
