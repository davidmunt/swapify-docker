import {
    IsString,
    IsOptional,
    IsNotEmpty,
} from 'class-validator';

export class CreateProductSaleStateDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}

export class UpdateProductSaleStateDto {
  @IsString()
  @IsOptional()
  name: string;
  
  @IsString()
  @IsOptional()
  description: string;
}