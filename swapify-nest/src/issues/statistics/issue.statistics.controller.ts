import { Controller, Get } from '@nestjs/common';
import { StatisticsService } from './issue.statistics.service';

@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get('issues-statitics-status')
  async getIssuesByStatus() {
    return this.statisticsService.getIssuesStatisticsStatus();
  }
}
