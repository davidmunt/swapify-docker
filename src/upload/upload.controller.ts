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
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
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
      message: 'Archivo añadido con éxito',
      fileId: savedFile.id,
      url: `/upload/${file.filename}`,
    };
  }

  @Post('chat')
  @UseInterceptors(FileInterceptor('file', multerConfig))
  async uploadChatImages(@UploadedFile() file: Express.Multer.File,) {
    if (!file) {
      throw new HttpException('File upload failed', HttpStatus.BAD_REQUEST);
    }
    const uploadedFiles = await this.uploadService.saveFileMessage(file);
    return { message: 'Imágenes del chat subidas correctamente', files: uploadedFiles };
  }

  @Post('product')
  @UseInterceptors(FilesInterceptor('file', 10, multerConfig))
  async uploadProductImages(
    @UploadedFiles() files: Express.Multer.File[],
    @Body('product') id_product: string,
  ) {
    if (!files || files.length === 0) {
      throw new HttpException('No se han enviado archivos', HttpStatus.BAD_REQUEST);
    }
    const savedFiles = await Promise.all(
      files.map(file => this.uploadService.saveFileForProduct(file, parseInt(id_product))),
    );
    return {
      message: 'Imágenes añadidas con éxito',
      files: savedFiles.map(file => ({
        fileId: file.id,
        url: file.path,
      })),
    };
  }

  @Put('product')
  @UseInterceptors(FilesInterceptor('file', 10, multerConfig))
  async replaceProductImages(
    @UploadedFiles() files: Express.Multer.File[],
    @Body('product') id_product: string,
  ) {
    if (!files || files.length === 0) {
      throw new HttpException('No se han enviado archivos', HttpStatus.BAD_REQUEST);
    }
    await this.uploadService.replaceProductImages(parseInt(id_product), files);
    return {
      message: 'Imagenes reemplazadas con exito',
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
      throw new HttpException('No se ha enviado un archivo', HttpStatus.BAD_REQUEST);
    }
    return await this.uploadService.updateUpload(id, file);
  }

  @Delete(':id')
  deleteInventari(@Param('id') id: string) {
    return this.uploadService.deleteUpload(parseInt(id));
  }
}
