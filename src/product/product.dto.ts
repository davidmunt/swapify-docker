import { IsString, IsNumber, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  product_model: string;

  @IsString()
  @IsNotEmpty()
  product_brand: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  latitude_created: number;

  @IsNumber()
  @IsNotEmpty()
  longitude_created: number;

  @IsString()
  @IsNotEmpty()
  name_city_created: string;
}

export class UpdateProductDto {
  @IsString()
  @IsOptional()
  product_model: string;

  @IsString()
  @IsOptional()
  product_brand: string;

  @IsNumber()
  @IsOptional()
  price: number;

  @IsString()
  @IsOptional()
  description: string;

  @IsNumber()
  @IsOptional()
  latitude_created: number;

  @IsNumber()
  @IsOptional()
  longitude_created: number;

  @IsString()
  @IsOptional()
  name_city_created: string;
}
