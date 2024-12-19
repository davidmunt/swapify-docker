import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UploadEntity } from './upload.entity';
import * as path from 'path';
import { IssueConversationEntity } from '../issues_conversation/issues_conversation.entity';

@Injectable()
export class UploadService {
  constructor(
    @InjectRepository(UploadEntity)
    private readonly uploadRepository: Repository<UploadEntity>,
    @InjectRepository(IssueConversationEntity)
    private readonly issueConversationRepository: Repository<IssueConversationEntity>,
  ) {}

  async saveFile(file: Express.Multer.File, issueConversationId: number) {
    const issueConversation = await this.issueConversationRepository.findOne({
      where: { id_conversation: issueConversationId },
    });

    if (!issueConversation) {
      throw new Error(
        `IssueConversation con ID ${issueConversationId} no encontrado.`,
      );
    }
    const filePath = path.join('/upload', file.filename);
    const newUpload = this.uploadRepository.create({
      path: filePath,
      name: file.originalname,
      issueConversation,
    });
    return await this.uploadRepository.save(newUpload);
  }

  async getAlluploads(): Promise<any> {
    const result = await this.uploadRepository.find({
      relations: ['issueConversation'],
    });
    return result;
  }

  async getUpload(id?: number): Promise<any> {
    const result = await this.uploadRepository.findOneBy({
      id: id,
    });
    return result;
  }

  async updateUpload(id: number, file: Express.Multer.File): Promise<any> {
    const existingUpload = await this.uploadRepository.findOne({
      where: { id },
      relations: ['issueConversation'],
    });

    if (!existingUpload) {
      throw new HttpException('Upload no encontrado', HttpStatus.NOT_FOUND);
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
