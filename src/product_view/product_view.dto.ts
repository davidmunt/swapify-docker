import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SaveProductViewDto {
  @ApiProperty({ example: 'FsGPZ9oCsAZfZ7dNwVr3wyPhCVc2', description: 'ID del usuario' })
  @IsString()
  @IsNotEmpty()
  id_user: string;

  @ApiProperty({ example: 38, description: 'ID del producto' })
  @IsNotEmpty()
  id_product: number;
}
