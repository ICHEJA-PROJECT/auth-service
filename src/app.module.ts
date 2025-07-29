import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { envsValues } from './core/config/getEnvs';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: envsValues.DB_HOST,
      port: envsValues.DB_PORT,
      username: envsValues.DB_USERNAME,
      password: envsValues.DB_PASSWORD,
      database: envsValues.DB_NAME,
      autoLoadEntities: true,
      synchronize: false,
      logging: true,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
    }),
    AuthModule,
  ],
})
export class AppModule {}
