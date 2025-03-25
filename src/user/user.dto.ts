import {
    IsEmail,
    IsString,
    IsInt,
    Min,
    Max,
    Length,
    IsDateString,
    IsOptional,
    IsNotEmpty,
    IsNumber,
    MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
    @ApiProperty({ example: 'ur6IGn79fRhCkDlyE1AQicKBmu92' })
    @IsString()
    @IsNotEmpty()
    id_user: string;

    @ApiProperty({ example: 'contraseña' })
    @IsString()
    @IsNotEmpty()
    @Length(4, 250)
    password: string;

    @ApiProperty({ example: 'David' })
    @IsString()
    @IsNotEmpty()
    @Length(1, 50)
    name: string;

    @ApiProperty({ example: 'Muntean' })
    @IsString()
    @IsNotEmpty()
    @Length(1, 50)
    surname: string;

    @ApiProperty({ example: 1334567889 })
    @IsInt()
    @IsNotEmpty()
    @Min(1000000000)
    @Max(999999999999)
    telNumber: number;

    @ApiProperty({ example: 'david@gmail.com' })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ example: '2000-05-15' })
    @IsDateString()
    @IsNotEmpty()
    dateBirth: string;
}

export class UpdateUserDto {
    @ApiProperty({ example: 'David' })
    @IsString()
    @IsOptional()
    @Length(1, 50)
    name?: string;

    @ApiProperty({ example: 'Muntean' })
    @IsString()
    @IsOptional()
    @Length(1, 50)
    surname?: string;

    @ApiProperty({ example: 1334567889 })
    @IsInt()
    @IsOptional()
    @Min(1000000000)
    @Max(999999999999)
    telNumber?: number;

    @ApiProperty({ example: 'david@gmail.com' })
    @IsEmail()
    @IsOptional()
    email?: string;

    @ApiProperty({ example: '2004-05-15' })
    @IsDateString()
    @IsOptional()
    dateBirth?: string;

    @ApiProperty({ example: 'eJVhBdpWRe2V_qVm2hXK1C:APA91bFsb9r5O7xwpP076PPEkcH_Bl6GBct43Mu_7-oO0_UR2COO6dqohp7qVe90CTpWbIBIarvdBrYho2Ft7FmVUpxjKXKv7LMSs4Zp32E1AcNIAUoV7_c' })
    @IsString()
    @IsOptional()
    tokenNotifications?: string;
}

export class AddBallanceToUserDto {
    @ApiProperty({ example: 'ur6IGn79fRhCkDlyE1AQicKBmu92' })
    @IsString()
    @IsNotEmpty()
    id_user: string;

    @ApiProperty({ example: 100.50 })
    @IsNumber()
    @IsNotEmpty()
    @Min(0)
    balance: number;
}

export class AddRatingToUserDto {
    @ApiProperty({ example: 'ur6IGn79fRhCkDlyE1AQicKBmu92' })
    @IsString()
    @IsNotEmpty()
    id_user: string;

    @ApiProperty({ example: 'ud6IGn79fRhCkDlyE1AQicKBmu92' })
    @IsString()
    @IsNotEmpty()
    id_customer: string;

    @ApiProperty({ example: 1 })
    @IsNumber()
    @IsNotEmpty()
    id_product: number;

    @ApiProperty({ example: 4.50 })
    @IsNumber()
    @IsNotEmpty()
    @Min(0)
    rating: number;
}

export class ChangePasswordDto {
    @ApiProperty({ example: 'usuarioID123' })
    @IsString()
    id_user: string;
  
    @ApiProperty({ example: 'nuevaContraseña456' })
    @IsString()
    @MinLength(4)
    newPassword: string;
}
  