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
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from "../multer.config";
import { UploadService } from './upload.service';
import { UserService } from '../user/user.service';
import { Response } from 'express';
import * as path from 'path';
import * as fs from 'fs';

@Controller('upload')
export class UploadController {
  constructor(
    private uploadService: UploadService,
    private readonly userService: UserService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('file', multerConfig))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('id_user') id_user: string,
  ) {
    if (!file) {
      throw new HttpException('File upload failed', HttpStatus.BAD_REQUEST);
    }
    const savedFile = await this.uploadService.saveFile(file, id_user);
    await this.userService.vincularArchivo(id_user, savedFile.id);
    return {
      message: 'Archivo añadido con exito',
      fileId: savedFile.id, 
      url: `/upload/${file.filename}`,
    };
  }

  @Get('filename/:filename')
  getFileByName(@Param('filename') filename: string, @Res() res: Response) {
    const filePath = path.join(__dirname, '..', 'upload', 'img', filename);
    if (!fs.existsSync(filePath)) {
      throw new HttpException('Archivo no encontrado', HttpStatus.NOT_FOUND);
    }
    return res.sendFile(filePath);
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
