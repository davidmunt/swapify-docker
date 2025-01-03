import {
    IsString,
    IsOptional,
    IsNotEmpty,
} from 'class-validator';

export class CreateProductStateDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}

export class UpdateProductStateDto {
  @IsString()
  @IsOptional()
  name: string;
  
  @IsString()
  @IsOptional()
  description: string;
}