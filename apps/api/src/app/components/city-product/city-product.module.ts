import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CityProduct } from '../../models/city-product.entity';
import { CityProductResolver } from './city-product.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([CityProduct])],
  providers: [CityProductResolver],
})
export class CityProductModule {}
