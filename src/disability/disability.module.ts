import { Module } from '@nestjs/common';
import { DisabilityServiceTransport } from './transports/disability-service.transport';
import { StudentImpairmentRepositoryImp } from './data/repositories';

@Module({
  imports: [DisabilityServiceTransport],
  providers: [StudentImpairmentRepositoryImp],
  exports: [StudentImpairmentRepositoryImp],
})
export class DisabilityModule {}
