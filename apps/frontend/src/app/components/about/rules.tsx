import React, { useState } from 'react';
import { Content, Heading, Item, ListBox, Text } from '@adobe/react-spectrum';

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
        <ListBox aria-label="Alignment">
          <Item>population of 100 habitants</Item>
          <Item>1 square km land</Item>
          <Item>5 shacks</Item>
          <Item>1000 wood</Item>
          <Item>500 stone</Item>
          <Item>200 bread</Item>
        </ListBox>
      </Content>

      <Heading level={3}>Buildings</Heading>
      <Text>
        There are two types of buildings: accommodations and production sites. Each building has a fixed size in square kilometer that it occupies. In order to build a building the city must have the necessary products to pay the construction cost and enough space to fit the buildings size.
      </Text>

      <Heading level={4}>Accommodations</Heading>
      <Content>
        Housing is the main driver of productivity gains. Better housing increases the productivity of habitants. But better housing is also more costly to maintain. The increase in maintenance cost reflects the higher needs of people living in developed and productive countries. If maintenance costs of an accommodation are not paid, it will be abandoned. All habitants that lived in the building will become homeless.
        {/* - How to reactivate an abandoned accommodation? */}

      </Content>

      <Heading level={4}>Production Sites</Heading>
      <Text>
        The output of a production sites is influenced by various factors. The formula for the overall productivity of a production site is

        sum (habitantBaseProductivity * accommodationProductivityMultiplier * starvingProductivityMultiplier) / # workplaces

        Example:
        A forestry has a base output of 10 wood per round and has 5 workplaces. Assume that it employs 3 habitants. One of them is living in a shack, the other is homeless and the last is homeless and starving since 2 rounds. Thus the output multiplier of the forestry is

        (1 * productionMultiplierOfShack + 1 * productionMultiplierOfHomeless + 1 * productionMultiplierOfHomeless * productionMultiplierOfStarving2 + 2 * 0) / 5
        = (1 * 0.7 + 1 * 0.1 + 1 * 0.1 * 0.8 + 2 * 0) / 5
        = 0.88 / 5
        = 0.176

        After developing the city this may greatly increase. It can even rise above 1, so that the forestry produces more than 10 wood. Assume that again only 3 habitants are working at the forestry. But now all of them live in fincas and noone is starving.

        (3 * productionMultiplierOfFinca + 2 * 0) / 5
        = (3 * 2 + 2 * 0) / 5
        = 6/5
      </Text>

      <Heading level={3}>Habitants</Heading>
      <Content>
        - Habitants have a base productivity of 1
        {/* - Each habitant needs 3 nutrition units per day */}
        {/* - Each type of food yields a different amount of nutrition */}
        - Habitants live forever (they do not die)
      </Content>

      <Heading level={4}>Starving</Heading>
      <Text>
        Habitants that do not get enough food starve. Starving greatly decreases productivity until it reaches 0. This does not cause the habitant to die, but he will not contribute to the production of outputs in the production site that he is employed with.
      </Text>

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
