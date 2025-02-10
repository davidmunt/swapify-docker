import {
  IsString,
  IsOptional,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductSaleStateDto {
  @ApiProperty({ example: 'Subasta' }) 
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Este producto está en subasta y los usuarios pueden ofertar por él.' })
  @IsString()
  @IsNotEmpty()
  description: string;
}

export class UpdateProductSaleStateDto {
  @ApiProperty({ example: 'Subasta' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: 'Este producto está en subasta' })
  @IsString()
  @IsOptional()
  description?: string;
}
