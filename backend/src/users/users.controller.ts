import {
  Controller,
  Post,
  Body,
  Get,
  Delete,
  Param,
  Put,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Get('users')
  @HttpCode(HttpStatus.OK)
  async getAllUsers() {
    return this.usersService.findAll();
  }

  @Post('account/register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get('users/:id')
  @HttpCode(HttpStatus.OK)
  async getById(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Put('users/:id')
  @HttpCode(HttpStatus.OK)
  async update(@Body() createUserDto: CreateUserDto, @Param('id') id: string) {
    return this.usersService.update(createUserDto, id);
  }

  @Delete('users/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    return this.usersService.delete(id);
  }
}
