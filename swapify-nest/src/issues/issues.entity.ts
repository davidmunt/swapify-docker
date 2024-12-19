import { IssueConversationEntity } from '../issues_conversation/issues_conversation.entity';
import { User } from '../users/users.entity';
import { Status } from '../status/status.entity';
import { Inventari } from '../inventari/inventari.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Issue {
  @PrimaryGeneratedColumn()
  id_issue: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @Column()
  description: string;

  @UpdateDateColumn({ type: 'timestamp' })
  last_updated: Date;

  @Column()
  notes: string;

  @OneToMany(
    () => IssueConversationEntity,
    (issueConversation) => issueConversation.issue,
  )
  conversations: IssueConversationEntity[];

  @ManyToOne(() => User, (user) => user.issues)
  @JoinColumn({ name: 'id_user' })
  user: User;

  @ManyToOne(() => User, (user) => user.assignedIssues)
  @JoinColumn({ name: 'id_tecnic' })
  technician: User;

  @ManyToOne(() => Status, (status) => status.issues)
  @JoinColumn({ name: 'id_status' })
  status: Status;

  @ManyToOne(() => Inventari, (inventari) => inventari.fk_issue)
  @JoinColumn({ name: 'id_inventory' })
  fk_inventari: Inventari;
}
