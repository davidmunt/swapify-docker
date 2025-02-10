import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class ProductLikeDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  productId: number;

  @ApiProperty({ example: 'ur6IGn79fRhCkDlyE1AQicKBmu92' })
  @IsString()
  userId: string;
}
