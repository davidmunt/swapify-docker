import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from '../multer.config';
import { UploadService } from './upload.service';

@Controller('upload')
export class UploadController {
  private uploadService: UploadService;
  constructor(uploadService: UploadService) {
    this.uploadService = uploadService;
  }

  @Post()
  @UseInterceptors(FileInterceptor('file', multerConfig))
  async uploadFile(
    @UploadedFile() file,
    @Body('issueConversation') issueConversationId: number,
  ) {
    if (!file) {
      throw new Error('File upload failed');
    }
    const savedFile = await this.uploadService.saveFile(
      file,
      issueConversationId,
    );
    return {
      message: 'Archivo añadido con exito!',
      url: `http://localhost:8080/upload/${file.filename}`,
      name: savedFile.name,
      path: savedFile.path,
    };
  }

  @Get()
  getAlluploads() {
    return this.uploadService.getAlluploads();
  }

  @Get(':id')
  getUpload(@Param('id') id: string) {
    return this.uploadService.getUpload(parseInt(id));
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('uploadedFile', multerConfig))
  async updateUpload(
    @Param('id') id: number,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<any> {
    if (!file) {
      throw new HttpException(
        'No se ha enviado un archivo',
        HttpStatus.BAD_REQUEST,
      );
    }
    return await this.uploadService.updateUpload(id, file);
  }

  @Delete(':id')
  deleteInventari(@Param('id') id: string) {
    return this.uploadService.deleteUpload(parseInt(id));
  }
}
