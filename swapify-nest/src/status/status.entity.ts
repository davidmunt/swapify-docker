import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Issue } from '../issues/issues.entity';

@Entity()
export class Status {
  @PrimaryGeneratedColumn()
  id_status: number;

  @Column()
  description: string;

  @OneToMany(() => Issue, (issue) => issue.id_issue)
  issues: Issue[];
}
