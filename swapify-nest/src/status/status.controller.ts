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
import { StatusService } from './status.service';
import { CreateStatusDto } from './status.dto';
import { UpdateStatusDto } from './status.dto';

@Controller('Status')
export class StatusController {
  constructor(private readonly statusService: StatusService) {}

  @Get()
  getAllStatus(@Query('xml') xml?: string) {
    try {
      return this.statusService.getAllStatus(xml);
    } catch (err) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: err,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  getStatus(@Param('id') id: string, @Query('xml') xml?: string) {
    return this.statusService.getStatus(parseInt(id), xml);
  }

  @Post()
  createStatus(@Body() createStatusDto: CreateStatusDto) {
    return this.statusService.createStatus(createStatusDto);
  }

  @Put(':id')
  updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateStatusDto,
  ) {
    return this.statusService.updateStatus(parseInt(id), updateStatusDto);
  }

  @Delete(':id')
  deleteStatus(@Param('id') id: string) {
    return this.statusService.deleteStatus(parseInt(id));
  }
}
