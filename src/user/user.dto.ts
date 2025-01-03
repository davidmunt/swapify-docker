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
} from 'class-validator';
  
export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    id_user: string;
  
    @IsString()
    @IsNotEmpty()
    @Length(1, 50)
    name: string;
  
    @IsString()
    @IsNotEmpty()
    @Length(1, 50)
    surname: string;
  
    @IsInt()
    @IsNotEmpty()
    @Min(1000000000)
    @Max(999999999999)
    telNumber: number;
  
    @IsEmail()
    @IsNotEmpty()
    email: string;
  
    @IsDateString()
    @IsNotEmpty()
    dateBirth: string;
}

export class UpdateUserDto {
    @IsString()
    @IsOptional()
    @Length(1, 50)
    name?: string;
  
    @IsString()
    @IsOptional()
    @Length(1, 50)
    surname?: string;
  
    @IsInt()
    @IsOptional()
    @Min(1000000000)
    @Max(999999999999)
    telNumber?: number;
  
    @IsEmail()
    @IsOptional()
    email?: string;
  
    @IsDateString()
    @IsOptional()
    dateBirth?: string;
}
  