import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { UploadEntity } from './upload.entity';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'path';
import { IssueConversationEntity } from '../issues_conversation/issues_conversation.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([UploadEntity, IssueConversationEntity]),
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', 'upload', 'img'),
      serveRoot: '/upload',
    }),
  ],
  exports: [TypeOrmModule],
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule {}
