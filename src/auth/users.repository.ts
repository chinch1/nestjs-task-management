import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { User } from './user.entity';

@Injectable()
export class UsersRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.manager);
  }

  async createUser(authCredentialsDto: AuthCredentialsDto): Promise<User> {
    const { username, password } = authCredentialsDto;
    const user = this.create({
      username,
      password,
    });
    try {
      await this.save(user);
    } catch (error) {
      if (error.code === '23505')
        throw new ConflictException('Username already exists');
      else {
        throw new InternalServerErrorException();
      }
    }
    return user;
  }
}
