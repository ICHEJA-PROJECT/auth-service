import { Module } from '@nestjs/common';
import { envsValues } from 'src/core/config/getEnvs';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PREFERENCES_SERVICE_OPTIONS } from 'src/preferences/domain/constants/preferences_service_options';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: PREFERENCES_SERVICE_OPTIONS.PREFERENCES_SERVICE_NAME,
        transport: Transport.RMQ,
        options: {
          urls: envsValues.BROKER_HOSTS,
          queue: PREFERENCES_SERVICE_OPTIONS.PREFERENCES_QUEUE,
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
  ],
  exports: [
    ClientsModule.register([
      {
        name: PREFERENCES_SERVICE_OPTIONS.PREFERENCES_SERVICE_NAME,
        transport: Transport.RMQ,
        options: {
          urls: envsValues.BROKER_HOSTS,
          queue: PREFERENCES_SERVICE_OPTIONS.PREFERENCES_QUEUE,
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
  ],
})
export class PreferenceServiceTransport {}
