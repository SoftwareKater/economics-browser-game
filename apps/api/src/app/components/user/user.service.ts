import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { City } from '../../models/city.entity';
import { User } from '../../models/user.entity';
import { CityCreationService } from '../city/city-creation.service';
import { CreateUserAndCityInput } from './create-user-and-city-input.interface';

export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly cityCreationService: CityCreationService
  ) {}

  public async createUserAndCity(input: CreateUserAndCityInput) {
    const cityId = await this.cityCreationService.createCity(input.cityName);
    const newUser: Partial<User> = {
      email: input.email,
      name: input.nickName,
      passwordHash: '****',
      city: { id: cityId } as City,
    };
    const res = await this.userRepository.save(newUser);
    console.log(res);
    return true;
  }

  public async get() {
    return this.userRepository.find();
  }

  public async getUserById(userId: string) {
    return this.userRepository.findOne({
      where: { id: userId },
    });
  }

  /**
   * @param email
   * @returns User
   */
  public async getUserByEmail(email: string): Promise<User> {
    const res = await this.userRepository.findOneOrFail({
      where: { email },
      relations: ['city'],
    });
    return res;
  }
}
