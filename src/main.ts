import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { envsValues } from './core/config/getEnvs';

async function bootstrap() {
  const logger = new Logger('auth-service');

  // Create HTTP application for Swagger documentation
  const app = await NestFactory.create(AppModule);

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Enable CORS
  app.enableCors();

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Authentication Microservice')
    .setDescription('Microservice for user authentication and token validation')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Authentication', 'Authentication endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  // Start HTTP server for Swagger documentation
  const port = process.env.PORT || 3000;
  await app.listen(port);
  logger.log(`HTTP server running on port ${port}`);
  logger.log(
    `Swagger documentation available at http://localhost:${port}/docs`,
  );

  // Create microservice for RabbitMQ
  const microservice =
    await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
      transport: Transport.RMQ,
      options: {
        urls: envsValues.BROKER_HOSTS,
        queue: 'AUTH_QUEUE',
        queueOptions: {
          durable: true,
        },
      },
    });

  await microservice.listen();
  logger.log('Auth microservice is running...');
}

bootstrap();
