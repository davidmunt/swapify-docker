import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class SendMessageDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  productId: number;

  @ApiProperty({ example: 'Hola, ¿sigue disponible?' })
  @IsString()
  @IsNotEmpty()
  text: string;

  @ApiProperty({ example: 'ur6IGn79fRhCkDlyE1AQicKBmu92' })
  @IsString()
  @IsNotEmpty()
  sender: string;

  @ApiProperty({ example: 'qL8s2h7Kd3E6FjVp9XNyZaTBGm45' })
  @IsString()
  @IsNotEmpty()
  reciver: string;
}
