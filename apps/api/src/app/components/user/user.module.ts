import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Building } from '../../models/building.entity';
import { CityBuilding } from '../../models/city-building.entity';
import { CityProduct } from '../../models/city-product.entity';
import { City } from '../../models/city.entity';
import { Habitant } from '../../models/habitant.entity';
import { Product } from '../../models/product.entity';
import { User } from '../../models/user.entity';
import { CityCreationService } from '../city/city-creation.service';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Building,
      City,
      CityBuilding,
      CityProduct,
      Habitant,
      Product,
    ]),
  ],
  providers: [UserResolver, CityCreationService, UserService],
})
export class UserModule {}
