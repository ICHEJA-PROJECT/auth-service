import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { envsValues } from 'src/core/config/getEnvs';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { PersonaEntity, RolEntity, PersonaRolEntity } from './data/entities';
import {
  PersonaRepositoryImp,
  RolRepositoryImp,
  EncryptDataRepositoryImp,
} from './data/repositories';
import { PreferenceServiceTransport } from 'src/common/transports/preference-service.transport';

@Module({
  imports: [
    PreferenceServiceTransport,
    JwtModule.register({
      global: true,
      secret: envsValues.JWT_SECRET,
      signOptions: { expiresIn: envsValues.JWT_EXPIRATION },
    }),
    TypeOrmModule.forFeature([PersonaEntity, RolEntity, PersonaRolEntity]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    PersonaRepositoryImp,
    RolRepositoryImp,
    EncryptDataRepositoryImp,
  ],
  exports: [
    AuthService,
    PersonaRepositoryImp,
    RolRepositoryImp,
    EncryptDataRepositoryImp,
  ],
})
export class AuthModule {}
