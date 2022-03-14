import { OfferType } from '../../../models/offer-type.enum';

export interface PlaceOfferInput {
  productId: string;
  price: number;
  quantity: number;
  offerType: OfferType;
  expirationDate: Date;
  cityId: string;
}
