import React, { useState } from 'react';
import { Content, Heading, Item } from '@adobe/react-spectrum';

export const Rules = () => {
  return (
    <Content>
      <Heading level={3}>Cities</Heading>
      <Content>
        - To build new buildings (production sites, storages, and housing) players need building materials
        - Building materials include wood, steel, sand, etc.
      </Content>

      <Heading level={4}>Starting Endowment of Cities</Heading>
      <Content>
        - population of 100 habitants
        - 1 square km land
        - some basic buildings as a starting point
      </Content>

      <Heading level={3}>Buildings</Heading>
        - Have a size
        - To build a building, the city must have
          - the necessary products to pay the construction cost
          - enough space to fit the buildings size

      <Heading level={4}>Accommodations</Heading>
      <Content>
        Housing is the main driver of productivity gains. Better housing increases the productivity of habitants. But better housing is also more costly to maintain. The increase in maintenance cost reflects the higher needs of people living in developed and productive countries. If maintenance costs of an accommodation are not paid, it will be abandoned. All habitants that lived in the building will become homeless.
        {/* - How to reactivate an abandoned accommodation? */}

      </Content>

      <Heading level={4}>Production Sites</Heading>
      <Content>
        - Produce Output
      </Content>

      <Heading level={3}>Habitants</Heading>
      <Content>
        - Habitants have a base productivity of 1
        {/* - Each habitant needs 3 nutrition units per day */}
        {/* - Each type of food yields a different amount of nutrition */}
        - Habitants live forever (they do not die)
      </Content>

      <Heading level={4}>Starving</Heading>
      <Content>
        - habitants that do not get enough nutrition units starve
        - starving greatly decreases productivity until it reaches 0
        - (just like they are not born, your city will always house 1000 habitants)
      </Content>

      <Heading level={3}>Market</Heading>
      <Content>

        - the currency is Habitrons (H with two horzontal lines)
        - players can create offers and bids to engage in trade
        - an offer (and a bid) comprises a product, an amount and a price
        - when offering, the price is interpreted as a minimum price (player will sell at every price above the offer price)
        - when biddig, the price is interpreted as a maximum price (player will buy at every price below the bidding price)
        - every hour the market is cleared:
          - all offers and bids are sorted by product
          - then the offers and bids for each product are sorted (offers are sorted increasing by price, bids are sorted decreasing by price)
          - the highest bidder gets served first, the lowest offerer my serve first
          - the price will be the arithmetic mean between the offer and bid price
          - when the bidder is saturated, the next is served; when the offerer is sold out, the next will serve
          - this goes on until there is no bidder willing to buy at a price
      </Content>


    </Content>
  );
};

export default Rules;
