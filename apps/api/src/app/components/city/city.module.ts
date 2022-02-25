import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Building } from '../../models/building.entity';
import { CityBuilding } from '../../models/city-building.entity';
import { CityProduct } from '../../models/city-product.entity';
import { City } from '../../models/city.entity';
import { Habitant } from '../../models/habitant.entity';
import { Product } from '../../models/product.entity';
import { CityUpdateService } from './city-update.service';
import { CityResolver } from './city.resolver';
import { CityService } from './city.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Building,
      City,
      CityBuilding,
      CityProduct,
      Habitant,
      Product,
    ]),
  ],
  providers: [CityResolver, CityService, CityUpdateService],
})
export class CityModule {}
