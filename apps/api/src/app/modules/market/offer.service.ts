import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { City } from '../../models/city.entity';
import { OfferStatus } from '../../models/offer-status.enum';
import { OfferType } from '../../models/offer-type.enum';
import { Offer } from '../../models/offer.entity';
import { MarketTransaction } from '../../models/market-transaction.entity';
import { PlaceOfferInput } from './models/place-offer-input.interface';
import { Product } from '../../models/product.entity';
import { MarketTransactionService } from './services/market-transaction.service';
import { MakeTradeInput } from './models/make-trade-input.interface';

export class OfferService {
  private readonly logger = new Logger('OfferService');

  constructor(
    @InjectRepository(Offer)
    private offerRepository: Repository<Offer>,
    private readonly marketTransactionService: MarketTransactionService,
  ) { }

  public async placeOffer({
    productId,
    cityId,
    ...partialOffer
  }: PlaceOfferInput): Promise<Offer> {
    const newOffer: Partial<Offer> = {
      product: { id: productId } as Product,
      provider: { id: cityId } as City,
      datePlaced: new Date(),
      offerStatus: OfferStatus.OPEN, // newly created offers are always open
      ...partialOffer,
    };
    const saveResult = await this.offerRepository.save(newOffer);
    return saveResult;
  }

  /**
   * @todo Do i have to put a "reserved" marker on the offer at the very beginning of this method?
   *
   * @param cityId
   * @param offerId
   */
  public async takeOffer(
    cityId: string,
    offerId: string
  ): Promise<MarketTransaction | undefined> {
    const offer = await this.offerRepository.findOneOrFail(offerId, {
      relations: ['provider', 'product'],
    });
    if (!this.checkOffer(offer)) {
      throw Error(`Cannot take offer ${offerId}. Reason: Bad offer`);
    }
    if (!this.checkTaker()) {
      throw Error(`Cannot take offer ${offerId}. Reason: Bad taker`);
    }
    const transaction = this.createMakeTradeInput(cityId, offer) as MarketTransaction;
    await this.offerRepository.update(offerId, { offerStatus: OfferStatus.TAKEN });
    let saveResult;
    try {
      saveResult = this.marketTransactionService.makeTrade(transaction);
    } catch (err) {
      this.logger.error(`Transaction failed. Reson: ${err}`);
      // @todo: rollback whole transactions
    }
    return saveResult;
  }

  /**
   * Checks if the offer is still valid and available.
   *
   * @param offer the offer to be checked
   * @returns true if the offer can be taken
   */
  private checkOffer(offer: Offer): boolean {
    if (offer.offerStatus !== OfferStatus.OPEN) {
      this.logger.error(
        `Cannot take offer ${offer.id}. Reason: status is ${offer.offerStatus}`
      );
      return false;
    }
    const now = new Date();
    if (offer.expirationDate < now) {
      this.logger.error(
        `Cannot take offer ${offer.id}. Reason: It has expired on ${offer.expirationDate}`
      );
      return false;
    }
    return true;
  }

  /**
   * Checks if the taker has enough money to take the offer.
   */
  private checkTaker(): boolean {
    this.logger.error('checkTaker is not implemented');
    return true;
  }

  private createMakeTradeInput(cityId: string, offer: Offer): Partial<MakeTradeInput> {
    const newTransaction: Partial<MakeTradeInput> = {
      price: offer.price,
      quantity: offer.quantity,
      product: offer.product,
      date: new Date(),
    };
    if (offer.offerType === OfferType.BID) {
      newTransaction.seller = { id: cityId } as City;
      newTransaction.purchaser = { id: offer.provider.id } as City;
    }
    if (offer.offerType === OfferType.OFFER) {
      newTransaction.seller = { id: offer.provider.id } as City;
      newTransaction.purchaser = { id: cityId } as City;
    }
    return newTransaction;
  }

}
