import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { IssueConversationEntity } from '../issues_conversation/issues_conversation.entity';

@Entity('upload')
export class UploadEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  path: string;

  @Column()
  name: string;

  @ManyToOne(
    () => IssueConversationEntity,
    (issueConversation) => issueConversation.upload,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'id_issueConversation' })
  issueConversation: IssueConversationEntity;
}
