import { Module } from '@nestjs/common';
import { LabelsService } from './labels.service';

@Module({
  providers: [LabelsService],
  exports: [LabelsService],
})
export class LabelsModule {}
