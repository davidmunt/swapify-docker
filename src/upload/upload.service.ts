import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UploadEntity } from './upload.entity';
import * as path from 'path';
import * as fs from 'fs'; 
import { User } from '../user/user.entity';

@Injectable()
export class UploadService {
  constructor(
    @InjectRepository(UploadEntity)
    private readonly uploadRepository: Repository<UploadEntity>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async saveFile(file: Express.Multer.File, id_user: string) {
    const user = await this.userRepository.findOne({ where: { id_user } });
    if (!user) {
      throw new Error(`Usuario con ID ${id_user} no encontrado.`);
    }
    const filePath = path.join('/upload', file.filename);
    const newUpload = this.uploadRepository.create({
      path: filePath,
      name: file.originalname,
      user,
    });
    return await this.uploadRepository.save(newUpload);
  }

  async getAlluploads(): Promise<any> {
    const result = await this.uploadRepository.find({
      relations: ['user'],
    });
    return result;
  }

  async getUpload(id: number): Promise<any> {
    const upload = await this.uploadRepository.findOneBy({ id });
    if (!upload) {
      throw new HttpException('Upload no encontrado', HttpStatus.NOT_FOUND);
    }
    const host = process.env.HOST || 'http://localhost:3000';
    const link = `${upload.path}`;
    return {
      id: upload.id,
      link: link, 
      name: upload.name,
    };
  }

  async updateUpload(id: number, file: Express.Multer.File): Promise<any> {
    const existingUpload = await this.uploadRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!existingUpload) {
      throw new HttpException('Upload no encontrado', HttpStatus.NOT_FOUND);
    }
    const existingFilePath = path.join(__dirname, '..', existingUpload.path);
    if (fs.existsSync(existingFilePath)) {
      fs.unlinkSync(existingFilePath);
    }
    const updatedFilePath = path.join('/upload', file.filename);
    existingUpload.name = file.originalname;
    existingUpload.path = updatedFilePath;
    return await this.uploadRepository.save(existingUpload);
  }

  async deleteUpload(id: number): Promise<{ message: string }> {
    const result = await this.uploadRepository.delete(id);
    if (result.affected === 0) {
      throw new HttpException('Upload no encontrado', HttpStatus.NOT_FOUND);
    }
    return { message: 'Upload eliminado' };
  }
}
