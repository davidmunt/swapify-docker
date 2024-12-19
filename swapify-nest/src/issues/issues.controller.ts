import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  HttpStatus,
  HttpException,
  Body,
  Query,
} from '@nestjs/common';
import { IssuesService } from './issues.service';

@Controller('issues')
export class IssuesController {
  private IssuesService: IssuesService;
  constructor(IssuesService: IssuesService) {
    this.IssuesService = IssuesService;
  }
  @Get()
  getAllStatus(@Query('xml') xml?: string) {
    try {
      return this.IssuesService.getAllIssues(xml);
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

  @Post()
  createIssue(@Body() Issue) {
    return this.IssuesService.createIssue(Issue);
  }

  @Get(':id')
  getIssue(@Param('id') id: string, @Query('xml') xml?: string) {
    return this.IssuesService.getIssue(parseInt(id), xml);
  }

  @Put(':id')
  updateIssue(@Param('id') id: string, @Body() Issue) {
    return this.IssuesService.updateIssue(parseInt(id), Issue);
  }

  @Delete(':id')
  deleteIssue(@Param('id') id: string) {
    return this.IssuesService.deleteIssue(parseInt(id));
  }
}
