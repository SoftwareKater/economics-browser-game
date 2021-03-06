import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BuildingConstructionCost } from '../../models/building-construction-cost.entity';
import { BuildingInput } from '../../models/building-input.entity';
import { BuildingMaintenanceCost } from '../../models/building-maintenance-cost.entity';
import { BuildingOutput } from '../../models/building-output.entity';
import { Building } from '../../models/building.entity';
import { Product } from '../../models/product.entity';
import { BuildingResolver } from './building.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Building, BuildingConstructionCost, BuildingInput, BuildingMaintenanceCost, BuildingOutput, Product])],
  providers: [BuildingResolver],
})
export class BuildingModule {}
