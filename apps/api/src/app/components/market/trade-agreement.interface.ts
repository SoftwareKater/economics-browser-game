import { PlayersOffer } from "./players-offer.interface";

export interface TradeAgreement {
    seller: PlayersOffer;
    purchaser: PlayersOffer;
    tradePrice: number;
    tradeQuantity: number;
}