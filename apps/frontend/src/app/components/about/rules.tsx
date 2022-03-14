import React, { useState } from 'react';
import { Cell, Column, Content, Heading, Item, ListBox, Row, TableBody, TableHeader, TableView, Text, Well } from '@adobe/react-spectrum';

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
        <Well>
          F_t(K, L) = K^a * L^(1-a)
          L_t = sum(p_t) over all employees
          K_t =
          sum (habitantBaseProductivity * accommodationProductivityMultiplier * starvingProductivityMultiplier) / # workplaces
        </Well>

        Example:
        A forestry has a base output of 10 wood per round and has 5 workplaces. Assume that it employs 3 habitants. One of them is living in a shack, the other is homeless and the last is homeless and starving since 2 rounds. Thus the output multiplier of the forestry is
        <Well>
          (1 * productionMultiplierOfShack + 1 * productionMultiplierOfHomeless + 1 * productionMultiplierOfHomeless * productionMultiplierOfStarving2 + 2 * 0) / 5 <br />
          = (1 * 0.7 + 1 * 0.1 + 1 * 0.1 * 0.8 + 2 * 0) / 5 <br />
          = 0.88 / 5 <br />
          = 0.176
        </Well>

        After developing the city this may greatly increase. It can even rise above 1, so that the forestry produces more than 10 wood. Assume that again only 3 habitants are working at the forestry. But now all of them live in fincas and noone is starving.
        <Well>
          (3 * productionMultiplierOfFinca + 2 * 0) / 5 <br />
          = (3 * 2 + 2 * 0) / 5 <br />
          = 6/5 <br />
        </Well>
      </Text>

      <Heading level={3}>Habitants</Heading>
      <Content>
        - Habitants have a base skill of 1 for each production site
        - Habitants live forever (they do not die)
        - When talking about accommodations, habitants are referred to as residents
        - When talking about production sites, habitants are referred to as employees
      </Content>

      <Heading level={4}>Utility</Heading>
      <Text>
        Habitants gain utility from housing and food. The utility function is given by a Cobb-Douglas Utility Function
        {/* @todo: increate utility when eating different food */}
        {/* @todo: each habitant needs 3 nutrition units per day */}
        {/* @todo: each type of food yields a different amount of nutrition and utility */}
        <Well>
          U_t(h_t, f_t) = sqrt(h_t) * sqrt(f_t)
        </Well>
        The utility of a habitant is one of the main drivers of the habitants productivity.

        Since being homeless has a very low h value, you should build accommodations for your habitants. Even more important is having food for all your habitants, since eating nothing results in an f value of 0, the habitants utility will reduce to 0.
      </Text>

      <Heading level={4}>Skill</Heading>
      <Text>
        {/* industry specific skill (like mining, wood works, etc.) */}
        Habitants aquire skill as long as they are employed. Each habitant starts with a skill of 1 for each production site: s_0(habitant, production-site) = 1. Each round that the habitant is employed at a production site, the habitant skill in working at this production site increases. Let T be the round that the habitant started to work at the production site
        <Well>
          s_(t+1) = s_t + 0.01 * sqrt(t - T)
        </Well>
        The skill of a habitant is another main driver of the habitants productivity.

        When the habitant changes its employer, the skill level for that production site is freezed at the current value. As soon as the habitant aquires a new employment, he starts aquiring skills for the new production site. When he returns to his old employer he will continue to increase the skill for that production site. But since T will be reset to the current round, the aquiring of skill will be slow.
      </Text>

      <Heading level={4}>Productivity</Heading>
      <Text>
        Habitants productivity is given by
        <Well>
          p_t(s_t, U_t) = ???
        </Well>
      </Text>

      {/*<Heading level={4}>Starving</Heading>
      <Text>
        Habitants that do not get enough food starve. Starving greatly decreases productivity until it reaches 0. This does not cause the habitant to die, but he will not contribute to the production of outputs in the production site that he is employed with.
      </Text>
      <TableView
        aria-label="Table that shows how starving affects productivity"
      >
        <TableHeader>
          <Column>Rounds Starving</Column>
          <Column>Productivity Multiplier</Column>
        </TableHeader>
        <TableBody>
          <Row><Cell>0</Cell><Cell>1</Cell></Row>
          <Row><Cell>1</Cell><Cell>1</Cell></Row>
          <Row><Cell>2</Cell><Cell>0.95</Cell></Row>
          <Row><Cell>3</Cell><Cell>0.9</Cell></Row>
          <Row><Cell>4</Cell><Cell>0.8</Cell></Row>
          <Row><Cell>5</Cell><Cell>0.65</Cell></Row>
          <Row><Cell>6</Cell><Cell>0.45</Cell></Row>
          <Row><Cell>7</Cell><Cell>0.2</Cell></Row>
          <Row><Cell>8</Cell><Cell>0.15</Cell></Row>
          <Row><Cell>9</Cell><Cell>0.12</Cell></Row>
          <Row><Cell>10</Cell><Cell>0.1</Cell></Row>
          <Row><Cell>11</Cell><Cell>0.09</Cell></Row>
          <Row><Cell>...</Cell><Cell>...</Cell></Row>
          <Row><Cell>19</Cell><Cell>0.01</Cell></Row>
          <Row><Cell>20</Cell><Cell>0</Cell></Row>
        </TableBody>
      </TableView> */}

      <Heading level={3}>Market</Heading>
        - the currency is Habitrons (H with two horzontal lines)
        - players can create offers and bids to engage in trade
        - each offer and bid comprises a product, an amount, a price, and an expiration date
        - any player can accept offers and bids of other players
        - both offers and bits cannot be accepted in the first 5 Minutes after they were created

      <Heading level={4}>Offers</Heading>
        - an offer is the request to cell a certian amount of a product at a certain price
        - when a player places an offer the offered amount of the product is "freezed"
        - freezed amounts of products cannot be used by the city or the player
        - if and when the offer expires or is withdrawn, the player will get back the freezed amount
        - if the offer is accepted by another player, the freezed amount is transferred to the purchaser
        - accepting an offer requires the player to have enough money to pay for it

      <Heading level={4}>Bids</Heading>
        - a bid is the request to buy a certain amount of a product at a certain price
        - when a player places a bid the offered price is freezed from his money
        - freezed amounts of money cannot be used by the player
        - if and when the bid expires or is withdrawn, the player will get back the freezed amount of money
        - if the bid is accepted by another player, the freezed amount of money is transferred to the seller
        - accepting a bid requires the player to have enough of the product to fullfil the bid

      <Heading level={4}>Market Clearing</Heading>
      <Content>
        - Since keeping track of offers and bids in the market is a very time consuming task there is a market clearing algorithm
        - Every day at midnight the market will be cleared
        - If you do not want your offer/bid to be regarded by the market clearing algorithm you have to opt out during creation of your offer/bid
        - when offering, the price is interpreted as a minimum price (player will sell at every price above the offer price)
        - when biddig, the price is interpreted as a maximum price (player will buy at every price below the bidding price)
        - market clearing algorithm:
          - all offers and bids are sorted by product
          - then the offers and bids for each product are sorted (offers are sorted increasing by price, bids are sorted decreasing by price, collisions will be resolved by creation date ascending)
          - the highest bidder gets served first, the lowest offerer my serve first
          - the price will be the arithmetic mean between the offer and bid price
          - when the bidder is saturated, the next is served; when the offerer is sold out, the next will serve
          - this goes on until there is no bidder willing to buy at the offerers price
          - opt in market price option

        Example:
          Suppose there are 4 offers for wood in the market:
          Player O1 offers 100 wood at 1H
          Player O2 offers 100 wood at 2H
          Player O3 offers 100 wood at 3H (without "market price" option)
          Player O4 offers 100 wood at 4H (with "market price" option)

          On the bidding side there are only 2 Players:
          Player B1 asks 150 wood at 3H
          Player B2 asks 100 wood at 2H (without "market price" option)
          Player B3 asks 100 wood at 1H (with "market price" option)

          The marking clearing algorithm will resolve this situation as follows:
          Player O1 ships 100 wood to player B1 at the price of 1 + (3-1)/2 = 2H
          Player O2 ships 50 wood to player B1 at the price of 2 + (3-2)/2 = 2.5H
          Player O2 ships 50 wood to Player B2 at the price of 2 + (2-2)/2 = 2H

          The current market price for wood is (100 * 2 + 50 * 2.5 + 50 * 2) / (100 + 50 + 50) = 2.125H

          Since O3 and B2 have chosen to go for "strict prices": Player O3 will not ship any goods, because his price is too high; Players B2 receives only 50 of his asked 100 wood, because his bid is too low. But since O4 and B3 have chosen the "market price" option the final result of the market clearing will be:

          Player O4 ships 100 wood to Player B3 at the market price of 2.125H
      </Content>

      <Heading level={3}>Federal Government</Heading>
      <Content>
        The federal government is modeled according to MMT. It can create money from nowhere and uses that money to buy goods on the market. When engaging in the market the government will be served like every other bidder - only that it asks huge amounts of the goods. These government engagements in the market will be announced in the newspapers, so that cities can prepare.
      </Content>

      <Heading level={4}>Taxes</Heading>
      <Content>
        At any time the government may introduce taxes of various kinds (property taxes (Grundsteuern), Gewerbesteuern, Umsatzsteuern, Vermögenssteuern, etc.). It may distribute parts of or the whole tax revenue back to the citys in any way that it deems appropriate (allowances, Subsidising industries, etc.)
      </Content>

      <Heading level={3}>Central Bank</Heading>
      <Content>
        There is no central bank involved.
      </Content>
    </Content>
  );
};

export default Rules;
