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
  QRRepositoryImp,
} from './data/repositories';
import { DisabilityModule } from 'src/disability/disability.module';

@Module({
  imports: [
    DisabilityModule,
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
    QRRepositoryImp,
  ],
  exports: [
    AuthService,
    PersonaRepositoryImp,
    RolRepositoryImp,
    EncryptDataRepositoryImp,
    QRRepositoryImp,
  ],
})
export class AuthModule {}
