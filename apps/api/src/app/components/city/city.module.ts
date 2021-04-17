import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Building } from '../../models/building.entity';
import { CityDevelopment } from '../../models/city-development.entity';
import { City } from '../../models/city.entity';
import { Habitant } from '../../models/habitant.entity';
import { CityResolver } from './city.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Building, City, CityDevelopment, Habitant])],
  providers: [CityResolver],
})
export class CityModule {}
