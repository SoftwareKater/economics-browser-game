import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { City } from '../../models/city.entity';
import { OfferType } from '../../models/offer-type.enum';
import { Offer } from '../../models/offer.entity';
import { User } from '../../models/user.entity';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { GqlCurrentUser } from '../auth/gql-current-user.decorator';
import { OfferService } from './offer.service';

@Resolver(() => Offer)
export class MarketResolver {
  constructor(private readonly offerService: OfferService) {}

  /**
   *
   */
  @UseGuards(GqlAuthGuard)
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  @Mutation((returns) => City, { name: 'placeOffer' })
  async placeOffer(
    @GqlCurrentUser() user: User,
    @Args({ name: 'productId', type: () => String }) productId: string,
    @Args({ name: 'price', type: () => Number }) price: number,
    @Args({ name: 'quantity', type: () => Number }) quantity: number,
    @Args({ name: 'offerType', type: () => OfferType }) offerType: OfferType,
    @Args({ name: 'expirationDate', type: () => Date }) expirationDate: Date
  ) {
    this.offerService.placeOffer({
      city: user.city,
      expirationDate,
      offerType,
      price,
      productId: productId,
      quantity,
    });
  }

  /**
   *
   */
  @UseGuards(GqlAuthGuard)
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  @Mutation((returns) => City, { name: 'takeOffer' })
  async takeOffer(
    @GqlCurrentUser() user: User,
    @Args({ name: 'offerId', type: () => String }) offerId: string
  ) {
    this.offerService.takeOffer(user.city.id, offerId);
  }
}
