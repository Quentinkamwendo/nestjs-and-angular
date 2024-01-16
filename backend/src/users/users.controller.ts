import {
  Controller,
  Post,
  Body,
  Get,
  Delete,
  Param,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
// import { LocalAuthGuard } from '../auth/local-auth.guard';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Get('api/users')
  async getAllUsers() {
    return this.usersService.findAll();
  }

  @Post('api/account/register')
  async register(@Body() createUserDto: CreateUserDto) {
    // const user = await this.usersService.create(createUserDto);
    // const { password, ...result } = user;
    // return result;
    return this.usersService.create(createUserDto);
  }

  @Get('api/users/:id')
  async getById(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Put('api/users/:id')
  async update(@Body() createUserDto: CreateUserDto, @Param('id') id: string) {
    return this.usersService.update(createUserDto, id);
  }

  @Delete('api/users/:id')
  async delete(@Param('id') id: string) {
    return this.usersService.delete(id);
  }
  // @UseGuards(LocalAuthGuard)
  // @UseGuards(AuthGuard('local'))
  // @Post('login')
  // async login(@Body() createUserDto: CreateUserDto) {
  //   return this.authService.login(createUserDto);
  //   return this.authService.validateUser(
  //     createUserDto.username,
  //     createUserDto.password,
  //   );
  // }
}
