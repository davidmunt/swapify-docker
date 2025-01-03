import {
    Body,
    Controller,
    Delete,
    Get,
    HttpException,
    HttpStatus,
    Param,
    Post,
    Put,
    Query,
} from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './user.dto';
import { UserService } from './user.service';
  
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  
  @Get()
  async getAllUsers(@Query('xml') xml?: string) {
    try {
      return await this.userService.getAllUsers(xml);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  
  @Get(':id')
  async getUser(@Param('id') id: string, @Query('xml') xml?: string) {
    return this.userService.getUser(id, xml);
  }
  
  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Put(':id')
  async updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateUser(id, updateUserDto);
  }
  
  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }
}  