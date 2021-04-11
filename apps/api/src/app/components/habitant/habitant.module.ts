import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Habitant } from '../../models/habitant.entity';
import { HabitantResolver } from './habitant.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Habitant])],
  providers: [HabitantResolver],
})
export class HabitantModule {}
