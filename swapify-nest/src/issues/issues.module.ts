import { Module } from '@nestjs/common';
import { IssuesController } from './issues.controller';
import { IssuesService } from './issues.service';
import { UtilsModule } from '../utils/utils.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Issue } from './issues.entity';
//import { StatisticsModule } from './statistics/statistics.module';
import { User } from 'src/users/users.entity';

@Module({
  imports: [UtilsModule, TypeOrmModule.forFeature([Issue, User])],
  exports: [TypeOrmModule],
  controllers: [IssuesController],
  providers: [IssuesService],
})
export class IssuesModule {}
