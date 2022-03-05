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

  public async createUserAndCity(
    input: CreateUserAndCityInput
  ): Promise<boolean> {
    const cityId = await this.cityCreationService.createCity(input.cityName);
    const passwordHash = input.password; // @todo hash password
    const newUser: Partial<User> = {
      email: input.email,
      name: input.nickName,
      passwordHash: passwordHash,
      city: { id: cityId } as City,
    };

    console.log('Creating new user with name ', newUser.name);
    const res = await this.userRepository.save(newUser);
    return true;
  }

  public async get() {
    return this.userRepository.find();
  }

  public async getUserById(userId: string) {
    return this.userRepository.findOneOrFail({
      where: { id: userId },
      relations: ['city'],
    });
  }

  /**
   * @param email
   * @returns User
   */
  public async getUserByEmail(email: string): Promise<User> {
    const res = await this.userRepository.findOneOrFail({
      where: { email },
    });
    return res;
  }
}
