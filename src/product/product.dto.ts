import {
  IsString,
  IsNumber,
  IsOptional,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ example: 'iPhone 14' })
  @IsString()
  @IsNotEmpty()
  product_model: string;

  @ApiProperty({ example: 'Apple' })
  @IsString()
  @IsNotEmpty()
  product_brand: string;

  @ApiProperty({ example: 999.99 })
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiProperty({ example: 'Teléfono en perfecto estado, comprado hace un año' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 38.8100574 })
  @IsNumber()
  @IsNotEmpty()
  latitude_created: number;

  @ApiProperty({ example: -0.6028540 })
  @IsNumber()
  @IsNotEmpty()
  longitude_created: number;

  @ApiProperty({ example: 'Valencia' })
  @IsString()
  @IsNotEmpty()
  name_city_created: string;

  @ApiProperty({ example: 'ur6IGn79fRhCkDlyE1AQicKBmu92' })
  @IsString()
  @IsNotEmpty()
  user_id: string;

  @ApiProperty({ example: 1 }) 
  @IsNumber()
  @IsNotEmpty()
  id_category_product: number; 

  @ApiProperty({ example: 2 })
  @IsNumber()
  @IsNotEmpty()
  id_state_product: number; 

  @ApiProperty({ example: 1 }) 
  @IsNumber()
  @IsNotEmpty()
  id_sale_state_product: number; 
}

export class UpdateProductDto {
  @ApiProperty({ example: 'Galaxy S23' })
  @IsString()
  @IsOptional()
  product_model?: string;

  @ApiProperty({ example: 'Samsung' })
  @IsString()
  @IsOptional()
  product_brand?: string;

  @ApiProperty({ example: 899.99 })
  @IsNumber()
  @IsOptional()
  price?: number;

  @ApiProperty({ example: 'Smartphone de última generación' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 38.8100574 })
  @IsNumber()
  @IsOptional()
  latitude_created?: number;

  @ApiProperty({ example: -0.6028540 })
  @IsNumber()
  @IsOptional()
  longitude_created?: number;

  @ApiProperty({ example: 'Madrid' })
  @IsString()
  @IsOptional()
  name_city_created?: string;

  @ApiProperty({ example: 3 })
  @IsNumber()
  @IsNotEmpty()
  id_category_product: number; 

  @ApiProperty({ example: 3 })
  @IsNumber()
  @IsNotEmpty()
  id_state_product: number; 

  @ApiProperty({ example: 2 })
  @IsNumber()
  @IsNotEmpty()
  id_sale_state_product: number; 

  @ApiProperty({ example: 'M49GpUq9SFdVWEvBpzlkDTkWovJ3' })
  @IsString()
  @IsNotEmpty()
  buyer_id: string;
}

export class FilterProductDto {
  @ApiProperty({ example: 'iPhone', required: false })
  @IsString()
  @IsOptional()
  busqueda?: string;

  @ApiProperty({ example: 1500, required: false })
  @IsNumber()
  @IsOptional()
  precioMax?: number;

  @ApiProperty({ example: 500, required: false })
  @IsNumber()
  @IsOptional()
  precioMin?: number;

  @ApiProperty({ example: 1, required: false })
  @IsNumber()
  @IsOptional()
  categoriaProd?: number;

  @ApiProperty({ example: 50, required: false })
  @IsNumber()
  @IsOptional()
  proximidad?: number;

  @ApiProperty({ example: 38.8100574, required: false })
  @IsNumber()
  @IsOptional()
  latitud_usuario?: number;

  @ApiProperty({ example: -0.6028540, required: false })
  @IsNumber()
  @IsOptional()
  longitud_usuario?: number;
}

export class BuyProductDto {
  @ApiProperty({ example: 5 })
  @IsNumber()
  @IsNotEmpty()
  productId: number;

  @ApiProperty({ example: 'M49GpUq9SFdVWEvBpzlkDTkWovJ3' })
  @IsString()
  @IsNotEmpty()
  buyerId: string;

  @ApiProperty({ example: 'ur6IGn79fRhCkDlyE1AQicKBmu92' })
  @IsString()
  @IsNotEmpty()
  sellerId: string;
}
