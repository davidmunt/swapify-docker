import { Module } from '@nestjs/common';
import { ClassroomController } from './classroom.controller';
import { ClassroomService } from './classroom.service';
import { UtilsModule } from '../utils/utils.module';
import { Classroom } from './classroom.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UtilsService } from '../utils/utils.service';
import { Inventari } from 'src/inventari/inventari.entity';
import { Inventari_type } from 'src/inventari_type/inventari_type.entity';

@Module({
  imports: [
    UtilsModule,
    TypeOrmModule.forFeature([Classroom, Inventari, Inventari_type]),
  ],
  controllers: [ClassroomController],
  providers: [ClassroomService, UtilsService],
  exports: [ClassroomService],
})
export class ClassroomModule {}
