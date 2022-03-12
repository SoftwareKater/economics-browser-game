import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Building } from '../../models/building.entity';
import { CityBuilding } from '../../models/city-building.entity';
import { CityProduct } from '../../models/city-product.entity';
import { City } from '../../models/city.entity';
import { Habitant } from '../../models/habitant.entity';
import { Product } from '../../models/product.entity';
import { CityCreationService } from './services/city-creation.service';
import { CityUpdateService } from './services/city-update.service';
import { CityResolver } from './city.resolver';
import { CityService } from './services/city.service';
import { BullModule } from '@nestjs/bull';
import { CityUpdateProcessor } from './city-update.processor';
import { CITY_UPDATES_QUEUE_NAME } from './constants';

const CityUpdatesQueueModule = BullModule.registerQueue({
  name: CITY_UPDATES_QUEUE_NAME,
  redis: {
    host: 'localhost',
    port: 6379,
  },
});

const TypeOrmFeatureModule = TypeOrmModule.forFeature([
  Building,
  City,
  CityBuilding,
  CityProduct,
  Habitant,
  Product,
]);

@Module({
  imports: [CityUpdatesQueueModule, TypeOrmFeatureModule],
  providers: [
    CityResolver,
    CityService,
    CityCreationService,
    CityUpdateService,
    CityUpdateProcessor,
  ],
  exports: [CityCreationService],
})
export class CityModule {}
