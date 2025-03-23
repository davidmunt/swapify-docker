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
import * as QRCode from 'qrcode';
import { ApiOperation, ApiResponse, ApiTags, ApiConsumes, ApiBody } from '@nestjs/swagger';


@ApiTags('Upload')
@Controller('upload')
export class UploadController {
  constructor(
    private uploadService: UploadService,
    private readonly userService: UserService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('file', multerConfig))
  @ApiOperation({ summary: 'Subir un archivo' })
  @ApiResponse({ status: 201, description: 'Archivo subido exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos de entrada no válidos' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        id_user: { type: 'string' },
      },
    },
  })
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
  @ApiOperation({ summary: 'Subir imagen de chat' })
  @ApiResponse({ status: 201, description: 'Imagen subida correctamente' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  async uploadChatImages(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new HttpException('File upload failed', HttpStatus.BAD_REQUEST);
    }
    const uploadedFiles = await this.uploadService.saveFileMessage(file);
    return { message: 'Imagenes del chat subidas correctamente', files: uploadedFiles };
  }

  @Post('product')
  @UseInterceptors(FilesInterceptor('file', 10, multerConfig))
  @ApiOperation({ summary: 'Subir imagenes de producto' })
  @ApiResponse({ status: 201, description: 'Imagenes añadidas con exito' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'array', items: { type: 'string', format: 'binary' } },
        product: { type: 'string' },
      },
    },
  })  
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
      message: 'Imagenes añadidas con exito',
      files: savedFiles.map(file => ({
        fileId: file.id,
        url: file.path,
      })),
    };
  }

  @Put('product')
  @UseInterceptors(FilesInterceptor('file', 10, multerConfig))
  @ApiOperation({ summary: 'Reemplazar imagenes de un producto' })
  @ApiResponse({ status: 200, description: 'Imagenes reemplazadas con exito' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'array', items: { type: 'string', format: 'binary' } },
        product: { type: 'string' },
      },
    },
  })  
  async replaceProductImages(
    @UploadedFiles() files: Express.Multer.File[],
    @Body('product') id_product: string,
  ) {
    if (!files || files.length === 0) {
      throw new HttpException('No se han enviado archivos', HttpStatus.BAD_REQUEST);
    }
    await this.uploadService.replaceProductImages(parseInt(id_product), files);
    return {
      message: 'Imagenes reemplazadas con éxito',
    };
  }

  @Post('generate-qr')
  @ApiOperation({ summary: 'Generar un código QR' })
  @ApiResponse({ status: 201, description: 'Código QR generado correctamente' })
  @ApiResponse({ status: 400, description: 'Datos de entrada no válidos' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async generateQRCode(@Body() body: { productId: number; userId: string }) {
    const { productId, userId } = body;
    if (!productId || !userId) {
      throw new HttpException('Falta por enviar datos', HttpStatus.BAD_REQUEST);
    }
    const qrData = JSON.stringify({ productId, userId });
    const uploadDir = path.join(__dirname, '..', 'upload', 'img');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    const qrFilename = `qr-${productId}-${userId}-${Date.now()}.png`;
    const qrPath = path.join(uploadDir, qrFilename);
    try {
      await QRCode.toFile(qrPath, qrData, {
        type: 'png',
        width: 300,
      });
      const savedQR = await this.uploadService.saveQRFile(qrFilename, `/upload/img/${qrFilename}`);
      return {
        message: 'Codigo QR generado correctamente',
        qrPath: savedQR.path,
      };
    } catch (error) {
      throw new HttpException(
        `Error al generar el código QR: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('generate-qr-exchange')
  @ApiOperation({ summary: 'Generar un código QR para intercambiar productos' })
  @ApiResponse({ status: 201, description: 'Código QR generado correctamente' })
  @ApiResponse({ status: 400, description: 'Datos de entrada no válidos' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async generateQRCodeExchange(@Body() body: { productId: number; userId: string, productExchangedId: number }) {
    const productId = body.productId;
    const productExchangedId = body.productExchangedId;
    const userId = body.userId;
    if (!productId || !productExchangedId  || !userId) {
      throw new HttpException('Falta por enviar datos', HttpStatus.BAD_REQUEST);
    }
    const qrData = JSON.stringify({ productId, productExchangedId, userId });
    const uploadDir = path.join(__dirname, '..', 'upload', 'img');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    const qrFilename = `qr-${productId}-${productExchangedId}-${userId}-${Date.now()}.png`;
    const qrPath = path.join(uploadDir, qrFilename);
    try {
      await QRCode.toFile(qrPath, qrData, {
        type: 'png',
        width: 300,
      });
      const savedQR = await this.uploadService.saveQRFile(qrFilename, `/upload/img/${qrFilename}`);
      return {
        message: 'Codigo QR generado correctamente',
        qrPath: savedQR.path,
      };
    } catch (error) {
      throw new HttpException(
        `Error al generar el código QR: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('filename/:filename')
  @ApiOperation({ summary: 'Obtener archivo por nombre' })
  @ApiResponse({ status: 200, description: 'Archivo encontrado' })
  getFileByName(@Param('filename') filename: string, @Res() res: Response) {
    const filePath = path.join(__dirname, '..', 'upload', 'img', filename);
    if (!fs.existsSync(filePath)) {
      throw new HttpException('Archivo no encontrado', HttpStatus.NOT_FOUND);
    }
    return res.sendFile(filePath);
  }

  @Get('img/:filename')
  @ApiOperation({ summary: 'Obtener imagen QR por nombre' })
  @ApiResponse({ status: 200, description: 'Imagen QR encontrada' })
  getQRCodeImage(@Param('filename') filename: string, @Res() res: Response) {
    const filePath = path.join(__dirname, '..', 'upload', 'img', filename);
    if (!fs.existsSync(filePath)) {
      throw new HttpException('Archivo no encontrado', HttpStatus.NOT_FOUND);
    }
    return res.sendFile(filePath);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las subidas' })
  @ApiResponse({ status: 200, description: 'Lista de archivos subida con éxito' })
  getAlluploads() {
    return this.uploadService.getAlluploads();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una subida por ID' })
  @ApiResponse({ status: 200, description: 'Archivo obtenido exitosamente' })
  getUpload(@Param('id') id: string) {
    return this.uploadService.getUpload(parseInt(id));
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('uploadedFile', multerConfig))
  @ApiOperation({ summary: 'Actualizar un archivo subido' })
  @ApiResponse({ status: 200, description: 'Archivo actualizado con éxito' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        uploadedFile: { type: 'string', format: 'binary' },
      },
    },
  })
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
  @ApiOperation({ summary: 'Eliminar un archivo subido por ID' })
  @ApiResponse({ status: 200, description: 'Archivo eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Archivo no encontrado' })
  deleteInventari(@Param('id') id: string) {
    return this.uploadService.deleteUpload(parseInt(id));
  }
}
