import { Module, forwardRef } from '@nestjs/common';
import { IssueConversationController } from './issues_conversation.controller';
import { IssueConversationService } from './issues_conversation.service';
import { UtilsModule } from '../utils/utils.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IssueConversationEntity } from './issues_conversation.entity';
import { UsersModule } from 'src/users/users.module';
import { FilesModule } from 'src/files/files.module';
@Module({
  imports: [
    UtilsModule, 
    TypeOrmModule.forFeature([IssueConversationEntity]),
    forwardRef(() => FilesModule),
    UsersModule],
  exports: [TypeOrmModule, IssueConversationService],
  controllers: [IssueConversationController],
  providers: [IssueConversationService],
})
export class IssuesConversationModule {}
