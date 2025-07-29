import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { envsValues } from './core/config/getEnvs';
import { AUTH_SERVICE_OPTIONS } from './common/domain/constants/auth_service_options';

async function bootstrap() {
  const logger = new Logger('auth-ms');

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: envsValues.BROKER_HOSTS,
        queue: AUTH_SERVICE_OPTIONS.AUTH_QUEUE,
        queueOptions: {
          durable: true,
        },
      },
    },
  );

  await app.listen();
  logger.log('Auth microservice is running...');
}

bootstrap();
