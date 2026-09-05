import { Module } from '@nestjs/common';
import { UksController } from './controllers/uks.controller';
import { UksService } from './services/uks.service';
import { UksRepository } from './repositories/uks.repository';

@Module({
  controllers: [UksController],
  providers: [UksService, UksRepository],
  exports: [UksService],
})
export class UksModule {}
