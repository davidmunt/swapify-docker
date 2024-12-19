import { Module, forwardRef } from '@nestjs/common';
import { FilesController } from './files.controller';
import { MulterModule } from '@nestjs/platform-express';
import { GridFsMulterConfigService } from './multer-config.service';
import { FilesService } from '././files.service';
import { InventariModule } from 'src/inventari/inventari.module';
import { IssuesConversationModule } from 'src/issues_conversation/issues_conversation.module';

@Module({
  imports: [
    MulterModule.registerAsync({
      useClass: GridFsMulterConfigService,
    }),
    InventariModule,
    forwardRef(() => IssuesConversationModule),
  ],
  controllers: [FilesController],
  providers: [GridFsMulterConfigService, FilesService],
  exports: [FilesService],
})
export class FilesModule {}
