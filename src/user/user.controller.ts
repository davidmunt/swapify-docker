import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AddBallanceToUserDto, CreateUserDto, UpdateUserDto } from './user.dto';
import { UserService } from './user.service';
import { User } from './user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todos los usuarios' })
  @ApiResponse({ status: 200, description: 'Lista de usuarios obtenida con exito', type: [User] })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async getAllUsers() {
    return await this.userService.getAllUsers();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un usuario por ID' })
  @ApiResponse({ status: 200, description: 'Usuario obtenido con exito', type: User })
  @ApiResponse({ status: 400, description: 'ID del usuario invalido' }) 
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  async getUser(@Param('id') id: string) {
    return this.userService.getUser(id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo usuario' })
  @ApiResponse({ status: 201, description: 'Usuario creado correctamente', type: User })
  @ApiResponse({ status: 400, description: 'Datos invalidos para la creacion del usuario' })
  @ApiResponse({ status: 409, description: 'ID o email del usuario ya estan en uso' })
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un usuario existente' })
  @ApiResponse({ status: 200, description: 'Usuario actualizado correctamente', type: User })
  @ApiResponse({ status: 400, description: 'Datos invalidos para la actualizacion del usuario' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  async updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un usuario' })
  @ApiResponse({ status: 200, description: 'Usuario eliminado correctamente' })
  @ApiResponse({ status: 400, description: 'ID del usuario invalido' }) 
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  async deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }

  @Post('addBallance')
  @ApiOperation({ summary: 'Añadir saldo' })
  @ApiResponse({ status: 201, description: 'Saldo añadido correctamente', type: User })
  @ApiResponse({ status: 400, description: 'Datos invalidos para añadir saldo al usuario' })
  async addBallanceToUser(@Body() addBallanceToUserDto: AddBallanceToUserDto) {
    return this.userService.addBallanceToUser(addBallanceToUserDto);
  }
}
