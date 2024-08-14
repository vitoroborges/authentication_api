import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}
  create(createUserDto: CreateUserDto) {
    const user = this.userRepository.create({ ...createUserDto });
    return this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ id: id });
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    if (user) {
      const updatedUser = await this.userRepository.preload({
        id: id,
        ...updateUserDto,
      });
      return await this.userRepository.save(updatedUser);
    } else {
      throw new NotFoundException(`User ID ${id} not found`);
    }
  }

  async remove(id: string): Promise<User> {
    const user = await this.findOne(id);
    if (user) {
      return await this.userRepository.remove(user);
    } else {
      throw new NotFoundException(`User ID ${id} not found`);
    }
  }
}
