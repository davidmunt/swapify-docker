import {
    IsString,
    IsOptional,
    IsNotEmpty,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductStateDto {
    @ApiProperty({ example: 'Reacondicionado' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: 'Este producto ha sido restaurado y está en óptimas condiciones de funcionamiento.' })
    @IsString()
    @IsNotEmpty()
    description: string;
}

export class UpdateProductStateDto {
  @ApiProperty({ example: 'Reacondicionado' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: 'Este producto ha sido restaurado' })
  @IsString()
  @IsOptional()
  description?: string;
}