import { registerEnumType } from '@nestjs/graphql';

export enum OfferType {
  OFFER = "offer",
  BID ="bid",
}

registerEnumType(OfferType, {
  name: 'OfferType',
  description: 'The type of the offer (offer/bid)',
});