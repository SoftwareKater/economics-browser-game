import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CityProduct } from '../../models/city-product.entity';
import { MarketTransaction } from '../../models/market-transaction.entity';
import { Offer } from '../../models/offer.entity';
import { MarketResolver } from './market.resolver';
import { OfferService } from './offer.service';

const TypeOrmFeatureModule = TypeOrmModule.forFeature([Offer, MarketTransaction, CityProduct]);

@Module({
  imports: [TypeOrmFeatureModule],
  providers: [
    MarketResolver,
    OfferService,
  ],
})
export class MarketModule {}
