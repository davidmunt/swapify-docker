import {
  IsString,
  IsOptional,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductCategoryDto {
  @ApiProperty({ example: 'Instrumentos Musicales' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Categoría para guitarras, pianos, baterías y otros instrumentos musicales.' })
  @IsString()
  @IsNotEmpty()
  description: string;
}

export class UpdateProductCategoryDto {
  @ApiProperty({ example: 'Instrumentos Musicales' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: 'Categoría para instrumentos.' })
  @IsString()
  @IsOptional()
  description?: string;
}
