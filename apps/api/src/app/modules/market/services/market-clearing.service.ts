import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Offer } from "../../../models/offer.entity";
import { Product } from "../../../models/product.entity";
import { MakeTradeInput } from "../models/make-trade-input.interface";
import { MarketTransactionService } from "./market-transaction.service";

export class MarketClearingService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    private readonly marketTransactionService: MarketTransactionService,
  ) { }

  /**
   * Clears the market by bringing together purchaseOffers and salesOffers that have not been accepted by any player
   * @todo: add the marketPrice optIn option (sellers and purchasers that do not fit together naturally trade at current market price)
   *
   * @param purchaseOffers bids
   * @param salesOffers offers
   */
  public async clearMarket(purchaseOffers: Offer[], salesOffers: Offer[]) {
    const products = await this.productRepo.find();
    for (const product of products) {
      const productPurchaseOffers = purchaseOffers.filter(offer => offer.product.id === product.id);
      productPurchaseOffers.sort((a, b) => a.price - b.price); // @todo: sort collisions by date
      const productSalesOffers = salesOffers.filter(offer => offer.product.id === product.id);
      productSalesOffers.sort((a, b) => a.price - b.price); // @todo: sort collisions by date

      let trade = true;
      while (trade) {
        const purchaseOffer = productPurchaseOffers[0];
        const sellOffer = productSalesOffers[0];
        const tradePrice = (purchaseOffer.price + sellOffer.price) / 2;
        const tradeQuantity = Math.min(
          purchaseOffer.quantity,
          sellOffer.quantity
        );
        const newTransaction: MakeTradeInput = {
          price: tradePrice,
          quantity: tradeQuantity,
          product: product,
          date: new Date(),
          seller: sellOffer.provider,
          purchaser: purchaseOffer.provider,
        };
        this.marketTransactionService.makeTrade(newTransaction);
        if (purchaseOffer.quantity === 0) {
          // the purchaser leaves the market for this product
          productPurchaseOffers.shift();
        }
        if (sellOffer.quantity === 0) {
          // the seller leaves the market for this product
          productSalesOffers.shift();
        }
        if (productSalesOffers[0].price > productPurchaseOffers[0].price) {
          // noone is willing to trade this product anymore
          trade = false;
        }
      }
    }
  }
}
