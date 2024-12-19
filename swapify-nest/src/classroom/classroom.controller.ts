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
  Query,
} from '@nestjs/common';
import { ClassroomService } from './classroom.service';
import { CreateClassroomDto } from './dto/create-classroom.dto';
import { UpdateClassroomDto } from './dto/update-classroom.dto';

@Controller('Classroom')
export class ClassroomController {
  private classroomService: ClassroomService;

  constructor(classroomService: ClassroomService) {
    this.classroomService = classroomService;
  }

  @Get()
  getAllClassrooms(@Query('xml') xml?: string) {
    try {
      return this.classroomService.getAllClassroom(xml);
    } catch (err) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: err,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: err,
        },
      );
    }
  }

  @Get(':id')
  getClassroom(@Param('id') id: string, @Query('xml') xml?: string) {
    return this.classroomService.getClassroom(parseInt(id), xml);
  }

  @Post()
  createClassroom(@Body() createClassroomDto: CreateClassroomDto) {
    return this.classroomService.createClassroom(createClassroomDto);
  }

  @Put(':id')
  updateClassroom(
    @Param('id') id: string,
    @Body() updateClassroomDto: UpdateClassroomDto,
  ) {
    return this.classroomService.updateClassroom(
      parseInt(id),
      updateClassroomDto,
    );
  }

  @Delete(':id')
  deleteClassroom(@Param('id') id: string) {
    return this.classroomService.deleteClassroom(parseInt(id));
  }

  @Get('/:id/devices')
  async obtenerDispositivosPorClase(@Param('id') id: number) {
    return await this.classroomService.obtenerDispositivosPorClase(id);
  }
}
