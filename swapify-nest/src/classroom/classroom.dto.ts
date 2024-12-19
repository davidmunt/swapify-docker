import { IsString } from 'class-validator';

export class CreateClassroomDto {
  @IsString()
  description: string;
}

export class UpdateClassroomDto {
  @IsString()
  description: string;
}
