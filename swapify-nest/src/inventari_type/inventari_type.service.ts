import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inventari_type } from './inventari_type.entity';
import { UtilsService } from '../utils/utils.service';

@Injectable()
export class InventariTypeService {
  constructor(
    @InjectRepository(Inventari_type)
    private readonly inventariTypeRepository: Repository<Inventari_type>,
    private readonly utilsService: UtilsService,
  ) {}

  async getAllInventariType(format?: string): Promise<any> {
    const inventariTypes = await this.inventariTypeRepository.find();

    if (format === 'xml') {
      const jsonForXml = JSON.stringify({ Inventory_types: inventariTypes });
      return this.utilsService.convertJSONtoXML(jsonForXml);
    }

    return inventariTypes;
  }

  async getInventariType(id_type: number, format?: string): Promise<any> {
    const inventariType = await this.inventariTypeRepository.findOne({
      where: { id_type: id_type },
    });

    if (!inventariType) {
      throw new HttpException(
        'Tipo de inventario no encontrado',
        HttpStatus.NOT_FOUND,
      );
    }

    if (format === 'xml') {
      const jsonForXml = JSON.stringify({ Inventory_type: inventariType });
      return this.utilsService.convertJSONtoXML(jsonForXml);
    }

    return inventariType;
  }
  async createInventariType(
    inventari_type: Partial<Inventari_type>,
  ): Promise<{ message: string }> {
    const newInventariType =
      this.inventariTypeRepository.create(inventari_type);
    await this.inventariTypeRepository.save(newInventariType);
    return { message: 'Tipo de inventario creado satisfactoriamente' };
  }

  async updateInventariType(
    id_type: number,
    inventariTypeUpdated: Partial<Inventari_type>,
  ): Promise<Inventari_type> {
    const inventariType = await this.inventariTypeRepository.findOne({
      where: { id_type: id_type },
    });

    if (!inventariType) {
      throw new HttpException(
        'Tipo de inventario no encontrado',
        HttpStatus.NOT_FOUND,
      );
    }

    await this.inventariTypeRepository.update(id_type, inventariTypeUpdated);

    return this.inventariTypeRepository.findOne({
      where: { id_type: id_type },
    });
  }

  async deleteInventariType(id_type: number): Promise<{ message: string }> {
    const result = await this.inventariTypeRepository.delete(id_type);

    if (result.affected === 0) {
      throw new HttpException(
        'Tipo de inventario no encontrado',
        HttpStatus.NOT_FOUND,
      );
    }

    return { message: 'Tipo de inventario eliminado satisfactoriamente' };
  }
}
