import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Building } from '../../models/building.entity';
import { BuildingResolver } from './building.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Building])],
  providers: [BuildingResolver],
})
export class BuildingModule {}
