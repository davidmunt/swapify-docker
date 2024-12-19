import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { UtilsService } from '../utils/utils.service';
import { Issue } from './issues.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/users.entity';

@Injectable()
export class IssuesService {
  constructor(
    private readonly UtilsService: UtilsService,
    @InjectRepository(Issue) private issueRepository: Repository<Issue>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getAllIssues(xml?: string): Promise<Issue[] | string> {
    const allIssues = await this.issueRepository.find({
      relations: ['user', 'technician', 'status', 'fk_inventari'],
    });
    if (xml == 'true') {
      const jsonForXml = JSON.stringify({
        Issues: allIssues,
      });
      const xmlResult = this.UtilsService.convertJSONtoXML(jsonForXml);
      return xmlResult;
    } else {
      return allIssues;
    }
  }

  async createIssue(issueData: any): Promise<Issue> {
    const technicianWithLeastIssues: User | null = await this.userRepository
      .createQueryBuilder('user')
      .leftJoin('user.assignedIssues', 'issue')
      .where('user.role = :role', { role: 2 })
      .groupBy('user.id_user')
      .orderBy('COUNT(issue.id_issue)', 'ASC')
      .getOne();

    if (!technicianWithLeastIssues) {
      throw new Error('No se encontró un técnico disponible');
    }

    const newIssue = this.issueRepository.create({
      ...issueData,
      technician: technicianWithLeastIssues,
    });
    const savedIssue = await this.issueRepository.save(newIssue);
    if (Array.isArray(savedIssue)) {
      throw new Error('save() returned an array, expected an object.');
    }
    return savedIssue;
  }

  async getIssue(id: number, xml?: string): Promise<Issue | string | null> {
    const issue = await this.issueRepository.findOneBy({ id_issue: id });
    if (issue != null) {
      if (xml === 'true') {
        const jsonForXml = JSON.stringify(issue);
        return this.UtilsService.convertJSONtoXML(jsonForXml);
      } else {
        return issue;
      }
    } else {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
  }

  async updateIssue(id: number, Issue: Issue): Promise<Issue> {
    const existingIssue = await this.issueRepository.findOneBy({
      id_issue: id,
    });
    if (!existingIssue) {
      throw new HttpException('Issue not found', HttpStatus.NOT_FOUND);
    }
    await this.issueRepository.update(id, Issue);
    return await this.issueRepository.findOneBy({ id_issue: id });
  }

  async deleteIssue(id: number): Promise<void> {
    await this.issueRepository.delete(id);
  }
}
