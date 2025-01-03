import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../user/user.entity';

@Entity('upload')
export class UploadEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'link' })
  path: string;

  @Column()
  name: string;

  @ManyToOne(
    () => User,
    (user) => user.upload,
    {
      onDelete: 'CASCADE', 
    },
  )
  @JoinColumn({ name: 'id_user' })
  user: User;
}
