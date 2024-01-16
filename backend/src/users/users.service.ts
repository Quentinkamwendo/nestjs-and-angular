import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }
  // async create(user: Partial<User>): Promise<User> {
  //   const newUser = this.userRepository.create(user);
  //   return this.userRepository.save(newUser);
  // }
  async create(createUserDto: CreateUserDto) {
    // const token = this.jwtService.sign();
    const hash = await bcrypt.hash(createUserDto.password, 10);
    const reqBody = {
      email: createUserDto.email,
      username: createUserDto.username,
      password: hash,
    };
    return this.userRepository.save(reqBody);

    // try {
    //   if (this.findByEmail(createUserDto.email) == null) {
    //     return this.userRepository.save(reqBody);
    //   }
    // } catch (error) {
    //   return JSON.stringify(error);
    // }
  }

  async findByUsername(username: string): Promise<User> {
    return this.userRepository.findOne({ where: { username: username } });
  }

  async findByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findById(id: string): Promise<User> {
    return this.userRepository.findOne({ where: { id } });
  }

  async delete(id: string) {
    return this.userRepository.delete(id);
  }

  async update(createUserDto: CreateUserDto, id: string) {
    return this.userRepository.update(id, createUserDto);
  }
}
