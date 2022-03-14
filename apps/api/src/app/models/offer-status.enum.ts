import { registerEnumType } from '@nestjs/graphql';

export enum OfferStatus {
  OPEN = "open",
  TAKEN ="taken",
  EXPIRED ="expired",
  WITHDRAWN ="withdrawn",
}

registerEnumType(OfferStatus, {
  name: 'OfferStatus',
  description: 'The status of the offer',
});