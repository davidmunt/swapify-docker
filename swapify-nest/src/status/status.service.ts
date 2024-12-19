import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Status } from './status.entity';
import { UtilsService } from '../utils/utils.service';
import { CreateStatusDto, UpdateStatusDto } from './status.dto';

@Injectable()
export class StatusService {
  constructor(
    private readonly utilsService: UtilsService,
    @InjectRepository(Status)
    private statusRepository: Repository<Status>,
  ) {}

  async getAllStatus(xml?: string): Promise<Status[] | string> {
    const statuses = await this.statusRepository.find();
    if (xml === 'true') {
      const jsonformatted = JSON.stringify({ Statuses: statuses });
      return this.utilsService.convertJSONtoXML(jsonformatted);
    }
    return statuses;
  }

  async getStatus(id: number, xml?: string): Promise<Status | string> {
    const status = await this.statusRepository.findOneBy({ id_status: id });
    if (!status) {
      throw new HttpException('Status not found', HttpStatus.NOT_FOUND);
    }
    if (xml === 'true') {
      const jsonformatted = JSON.stringify(status);
      return this.utilsService.convertJSONtoXML(jsonformatted);
    }
    return status;
  }

  async createStatus(
    createStatusDto: CreateStatusDto,
  ): Promise<{ message: string }> {
    const status = this.statusRepository.create({
      description: createStatusDto.description,
      issues: [],
    });

    await this.statusRepository.save(status);

    return { message: 'Status creado con éxito' };
  }

  async updateStatus(
    id: number,
    updateStatusDto: UpdateStatusDto,
  ): Promise<Status> {
    const status = await this.statusRepository.findOneBy({
      id_status: id,
    });

    if (!status) {
      throw new HttpException('Status no encontrado', HttpStatus.NOT_FOUND);
    }
    await this.statusRepository.update(id, updateStatusDto);

    return this.statusRepository.findOneBy({ id_status: id });
  }

  async deleteStatus(id: number): Promise<{ message: string }> {
    const result = await this.statusRepository.delete(id);
    if (result.affected === 0) {
      throw new HttpException('Status not found', HttpStatus.NOT_FOUND);
    }
    return { message: 'Status eliminado con éxito' };
  }
}
