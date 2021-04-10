import { PRODUCTS } from "../../mocks/products";
import { PlayersOffer } from "./players-offer.interface";
import { TradeAgreement } from "./trade-agreement.interface";

export class MarketController {
  /**
   * Clear the market: bring together sellers and purchasers, carry out transactions
   * @param purchaseOffers
   * @param salesOffers
   */
  clear(purchaseOffers: PlayersOffer[], salesOffers: PlayersOffer[]) {
    for (const product of PRODUCTS) {
      // filter all purchase offers by the product and sort them decreasing by price
      const productPurchaseOffers = purchaseOffers
        .filter((offer) => offer.offer.product.id === product.id)
        .sort((a, b) => a.offer.price - b.offer.price);
      // filter all sales offers by the product and sort them increasing by price
      const productSalesOffers = salesOffers
        .filter((offer) => offer.offer.product.id === product.id)
        .sort((a, b) => b.offer.price - a.offer.price);

      let trade = true;
      while (trade) {
        const purchaser = productPurchaseOffers[0];
        const seller = productSalesOffers[0];
        const tradePrice = (purchaser.offer.price + seller.offer.price) / 2;
        const tradeQuantity = Math.min(
          purchaser.offer.quantity,
          seller.offer.quantity
        );
        this.makeTrade({ purchaser, seller, tradePrice, tradeQuantity });
        if (purchaser.offer.quantity === 0) {
          // the purchaser leaves the market for this product
          productPurchaseOffers.shift();
        }
        if (seller.offer.quantity === 0) {
          // the seller leaves the market for this product
          productSalesOffers.shift();
        }
        if (productSalesOffers[0] > productPurchaseOffers[0]) {
          // noone is willing to trade this product anymore
          trade = false;
        }
      }
    }
  }

  /**
   * Carry out the transaction defined in @param tradeAgreement
   * @param tradeAgreement
   */
  private makeTrade(tradeAgreement: TradeAgreement): void {
    console.log(tradeAgreement);
    tradeAgreement.purchaser.offer.quantity += tradeAgreement.tradeQuantity;
    tradeAgreement.purchaser.player.money -= tradeAgreement.tradePrice;
    tradeAgreement.seller.offer.quantity -= tradeAgreement.tradeQuantity;
    tradeAgreement.seller.player.money += tradeAgreement.tradePrice;
  }
}
