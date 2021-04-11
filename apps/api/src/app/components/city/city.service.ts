import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { City } from '../../models/city.entity';
import { Habitant } from '../../models/habitant.entity';

@Injectable()
export class CityService {
  constructor(
    @InjectRepository(City)
    private cityRepository: Repository<City>
  ) {}

  public async createNewCity(options: { name: string }): Promise<void> {
    const uuid = 'd5ef62b9-17dd-4798-aa8c-dec029b65193';
    const newCity = {
      name: options.name,
      uuid,
    };
    const habitants: Habitant[] = [];
    try {
      await this.cityRepository.save({ ...newCity, habitants });
    } catch (err) {
      console.warn(err.message);
    }
  }
}
