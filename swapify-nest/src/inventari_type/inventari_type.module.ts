import { Module } from '@nestjs/common';
import { InventariTypeController } from './inventari_type.controller';
import { InventariTypeService } from './inventari_type.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inventari_type } from './inventari_type.entity';
import { UtilsModule } from '../utils/utils.module';

@Module({
  imports: [UtilsModule, TypeOrmModule.forFeature([Inventari_type])],
  controllers: [InventariTypeController],
  providers: [InventariTypeService],
})
export class InventariTypeModule {}
