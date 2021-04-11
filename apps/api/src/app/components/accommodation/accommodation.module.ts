import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Accommodation } from '../../models/accommodation.entity';
import { AccommodationResolver } from './accommodation.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Accommodation])],
  providers: [AccommodationResolver],
})
export class AccommodationModule {}