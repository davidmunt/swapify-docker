import { IsString } from 'class-validator';

export class CreateClassroomDto {
  @IsString()
  description: string;
}
