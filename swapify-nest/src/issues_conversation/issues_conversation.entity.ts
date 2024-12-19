import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Issue } from '../issues/issues.entity';
import { User } from '../users/users.entity';
import { UploadEntity } from '../upload/upload.entity';

@Entity('issue_conversation')
export class IssueConversationEntity {
  @PrimaryGeneratedColumn()
  id_conversation: number;

  @ManyToOne(() => Issue, (issue) => issue.conversations)
  @JoinColumn({ name: 'id_issue' })
  issue: Issue;

  @ManyToOne(() => User, (user) => user.issueConversations)
  @JoinColumn({ name: 'id_user' })
  user: User;

  @Column()
  notes: string;

  @Column()
  id_image: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @OneToMany(() => UploadEntity, (upload) => upload.issueConversation, {
    onDelete: 'CASCADE',
  })
  upload: UploadEntity[];
}
