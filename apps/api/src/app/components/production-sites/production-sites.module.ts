import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductionSite } from '../../models/production-site.entity';
import { ProductionSiteResolver } from './production-sites.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([ProductionSite])],
  providers: [ProductionSiteResolver],
})
export class ProductionSiteModule {}
