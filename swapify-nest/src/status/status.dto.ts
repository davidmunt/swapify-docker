import { IsString, IsNotEmpty } from 'class-validator';

export class CreateStatusDto {
  @IsString()
  @IsNotEmpty()
  description: string;
}

export class UpdateStatusDto {
  @IsString()
  description: string;
}
