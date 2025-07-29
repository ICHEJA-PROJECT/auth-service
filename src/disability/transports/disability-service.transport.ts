import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { envsValues } from 'src/core/config/getEnvs';

@Module({
  imports: [
    HttpModule.register({
      baseURL: envsValues.DISABILITY_SERVICE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    }),
  ],
  exports: [HttpModule],
})
export class DisabilityServiceTransport {}
