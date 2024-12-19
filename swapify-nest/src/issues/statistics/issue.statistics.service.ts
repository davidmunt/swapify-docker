import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Issue } from '../issues.entity';

@Injectable()
export class StatisticsService {
  constructor(
    @InjectRepository(Issue)
    private readonly issueRepository: Repository<Issue>,
  ) {}

  async getIssuesStatisticsStatus() {
    return this.issueRepository
      .createQueryBuilder('i')
      .innerJoin('i.status', 's')
      .select('s.description', 'status')
      .addSelect('COUNT(i.id_issue)', 'count')
      .groupBy('s.description')
      .getRawMany();
  }
}
