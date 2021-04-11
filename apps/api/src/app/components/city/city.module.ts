import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { City } from '../../models/city.entity';
import { CityResolver } from './city.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([City])],
  providers: [CityResolver],
})
export class CityModule {}
