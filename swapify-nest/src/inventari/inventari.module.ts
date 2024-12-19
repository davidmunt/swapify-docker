import { Module } from '@nestjs/common';
import { InventariController } from './inventari.controller';
import { InventariService } from './inventari.service';
import { Inventari } from './inventari.entity';
import { UtilsModule } from 'src/utils/utils.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LabelsModule } from 'src/utils/labels.module';

@Module({
  imports: [TypeOrmModule.forFeature([Inventari]), UtilsModule, LabelsModule],
  exports: [TypeOrmModule, InventariService],
  controllers: [InventariController],
  providers: [InventariService],
})
export class InventariModule {}
