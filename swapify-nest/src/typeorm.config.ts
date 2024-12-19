import { registerAs } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { Inventari_type } from './inventari_type/inventari_type.entity';
import { Inventari } from './inventari/inventari.entity';
import { Classroom } from './classroom/classroom.entity';
import { User } from './users/users.entity';
import { Issue } from './issues/issues.entity';
import { IssueConversationEntity } from './issues_conversation/issues_conversation.entity';
import { Status } from './status/status.entity';
import * as dotenv from 'dotenv';
import { UploadEntity } from './upload/upload.entity';

dotenv.config();

const config = {
  type: 'mysql',
  host: 'database',
  port: 3306,
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  entities: [
    Inventari_type,
    Inventari,
    Classroom,
    User,
    Issue,
    IssueConversationEntity,
    Status,
    UploadEntity,
  ],
  migrations: ['./src/migrations/*.ts'],
  synchronize: false,
};

export default registerAs('typeorm', () => config);
export const connectionSource = new DataSource(config as DataSourceOptions);
