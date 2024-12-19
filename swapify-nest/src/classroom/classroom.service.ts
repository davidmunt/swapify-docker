import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UtilsService } from '../utils/utils.service';
import { Classroom } from './classroom.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateClassroomDto } from './dto/create-classroom.dto';
import { UpdateClassroomDto } from './dto/update-classroom.dto';
import { Inventari } from 'src/inventari/inventari.entity';

@Injectable()
export class ClassroomService {
  constructor(
    private readonly utilsService: UtilsService,
    @InjectRepository(Classroom)
    private classroomRepository: Repository<Classroom>,
    @InjectRepository(Inventari)
    private inventariRepository: Repository<Inventari>,
  ) {}

  async obtenerDispositivosPorClase(classroomId: number): Promise<any> {
    const inventarioCompleto = await this.classroomRepository
      .createQueryBuilder('classroom')
      .leftJoinAndSelect('classroom.fk_inventari', 'inventari')
      .leftJoinAndSelect('inventari.fk_inventary_type', 'type')
      .select([
        'type.description AS deviceType',
        'COUNT(inventari.id_inventory) AS ConteoDispositivos',
        'inventari.id_inventory as id_inventory',
        'inventari.num_serie as num_serie',
        'inventari.brand as brand',
        'inventari.model as model',
        'inventari.GVA_cod_article as GVA_cod_article',
        'inventari.GVA_description_cod_articulo as GVA_description_cod_articulo',
        'inventari.status as status',
      ])
      .where('classroom.id_classroom = :classroomId', { classroomId })
      .groupBy('type.description')
      .addGroupBy('inventari.id_inventory')
      .getRawMany();

    const dispositivosPorTipo = {};
    let totalDispositivos = 0;

    inventarioCompleto.forEach((item) => {
      const tipo = item.deviceType;
      if (!dispositivosPorTipo[tipo]) {
        dispositivosPorTipo[tipo] = {
          dispositivos: [],
          conteo: 0,
        };
      }
      const dispositivo = {
        idInventario: item.id_inventory,
        numSerie: item.num_serie,
        brand: item.brand,
        model: item.model,
        GVA_cod_article: item.GVA_cod_article,
        GVA_description_cod_articulo: item.GVA_description_cod_articulo,
        status: item.status,
      };

      dispositivosPorTipo[tipo].dispositivos.push(dispositivo);
      dispositivosPorTipo[tipo].conteo += parseInt(item.ConteoDispositivos);
      totalDispositivos += parseInt(item.ConteoDispositivos);
    });
    const result = {
      dispositivosPorTipo,
      conteoTotal: totalDispositivos,
    };

    return result;
  }

  async getAllClassroom(xml?: string): Promise<Classroom[] | string> {
    const classrooms = await this.classroomRepository.find();

    if (xml === 'true') {
      const jsonformatted = JSON.stringify({ Classrooms: classrooms });
      return this.utilsService.convertJSONtoXML(jsonformatted);
    }

    return classrooms;
  }

  async createClassroom(
    createClassroomDto: CreateClassroomDto,
  ): Promise<{ message: string }> {
    const classroom = this.classroomRepository.create(createClassroomDto);
    await this.classroomRepository.save(classroom);
    return { message: 'Aula creada' };
  }

  async getClassroom(id: number, xml?: string): Promise<Classroom | string> {
    const classroom = await this.classroomRepository.findOneBy({
      id_classroom: id,
    });

    if (!classroom) {
      throw new HttpException('Classroom not found', HttpStatus.NOT_FOUND);
    }

    if (xml === 'true') {
      const jsonformatted = JSON.stringify(classroom);
      return this.utilsService.convertJSONtoXML(jsonformatted);
    }

    return classroom;
  }

  async updateClassroom(
    id: number,
    updateClassroomDto: UpdateClassroomDto,
  ): Promise<Classroom> {
    const classroom = await this.classroomRepository.findOneBy({
      id_classroom: id,
    });

    if (!classroom) {
      throw new HttpException('Classroom not found', HttpStatus.NOT_FOUND);
    }

    const updatedClassroom = this.classroomRepository.merge(
      classroom,
      updateClassroomDto,
    );
    return this.classroomRepository.save(updatedClassroom);
  }

  async deleteClassroom(id: number): Promise<{ message: string }> {
    const result = await this.classroomRepository.delete(id);
    if (result.affected === 0) {
      throw new HttpException('Classroom not found', HttpStatus.NOT_FOUND);
    }
    return { message: 'Aula eliminada' };
  }
}
