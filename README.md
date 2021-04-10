
# Economics1k


## Intro

- Browser / Handy game

### Players
- rule a city
- decide about the production in their city
- can engage in trade in a global market

### Cities
- Each habitant needs 3 nutrition units per day
- Each type of food yields a different amount of nutrition
- To build new  buildings (production sites, storages, and housing) players need building materials
- Building materials include wood, steel, sand, etc.
- To research new buildings players need "tech?" materials
- Tech materials include paper, ink, computerchips, etc.

### Start
- population of 1000 habitants
- 10qkm (10.000.000 qm) land to build stuff on
- each habitant lives in a tent

## Housing


productivity multiplicator: increases or decreases the number of units a habitant produces per day
capacity: how many habitants can live in the housing
size:

Examples
- a homeless habitant will not work
- 5 habitants can live in one villa, they will all receive a great boost to their productivity

## Production
-
- for exact values see <a href="./constants/production-sites.ts">production-sites.ts<a>

## Habitants

- base productivity: 1

### Starving

- habitants that do not get enough nutrition units starve
- starving greatly decreases productivity until it reaches 0
- habitants do not die
- (just like they are not born, your city will always house 1000 habitants)
- for exact values see <a href="./constants/starving.ts">starving.ts<a>

### Well fed

- habitants that eat more that 3 nutrition units will receive a productivity boost

## Market

- the currency is Habitrons (H with two horzontal lines)
- players can create offers and bids to engage in trade
- an offer (and a bid) comprises a product, an amount and a price
- when offering, the price is interpreted as a minimum price (player will sell at every price above the offer price)
- when biddig, the price is interpreted as a maximum price (player will buy at every price below the bidding price)
- every hour the market is cleared:
  - all offers and bids are sorted by product
  - then the offers and bids for each product are sorted (offers are sorted increasing by price, bids are sorted decreasing by price)
  - the highest bidder gets served first, the lowest offerer my serve first
  - the price will be the arithmetic mean betwenn the offer and bid price
  - when the bidder is saturated, the next is served; when the offerer is sold out, the next will serve
  - this goes on until there is no bidder willing to buy at a price

# Generated Readme

This project was generated using [Nx](https://nx.dev).

<p style="text-align: center;"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="450"></p>

🔎 **Powerful, Extensible Dev Tools**

## Adding capabilities to your workspace

Nx supports many plugins which add capabilities for developing different types of applications and different tools.

These capabilities include generating applications, libraries, etc as well as the devtools to test, and build projects as well.

Below are our core plugins:

- [React](https://reactjs.org)
  - `npm install --save-dev @nrwl/react`
- Web (no framework frontends)
  - `npm install --save-dev @nrwl/web`
- [Angular](https://angular.io)
  - `npm install --save-dev @nrwl/angular`
- [Nest](https://nestjs.com)
  - `npm install --save-dev @nrwl/nest`
- [Express](https://expressjs.com)
  - `npm install --save-dev @nrwl/express`
- [Node](https://nodejs.org)
  - `npm install --save-dev @nrwl/node`

There are also many [community plugins](https://nx.dev/nx-community) you could add.

## Generate an application

Run `nx g @nrwl/react:app my-app` to generate an application.

> You can use any of the plugins above to generate applications as well.

When using Nx, you can create multiple applications and libraries in the same workspace.

## Generate a library

Run `nx g @nrwl/react:lib my-lib` to generate a library.

> You can also use any of the plugins above to generate libraries as well.

Libraries are shareable across libraries and applications. They can be imported from `@economics1k/mylib`.

## Development server

Run `nx serve my-app` for a dev server. Navigate to http://localhost:4200/. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `nx g @nrwl/react:component my-component --project=my-app` to generate a new component.

## Build

Run `nx build my-app` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `nx test my-app` to execute the unit tests via [Jest](https://jestjs.io).

Run `nx affected:test` to execute the unit tests affected by a change.

## Running end-to-end tests

Run `ng e2e my-app` to execute the end-to-end tests via [Cypress](https://www.cypress.io).

Run `nx affected:e2e` to execute the end-to-end tests affected by a change.

## Understand your workspace

Run `nx dep-graph` to see a diagram of the dependencies of your projects.

## Further help

Visit the [Nx Documentation](https://nx.dev) to learn more.



## ☁ Nx Cloud

### Computation Memoization in the Cloud

<p style="text-align: center;"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-cloud-card.png"></p>

Nx Cloud pairs with Nx in order to enable you to build and test code more rapidly, by up to 10 times. Even teams that are new to Nx can connect to Nx Cloud and start saving time instantly.

Teams using Nx gain the advantage of building full-stack applications with their preferred framework alongside Nx’s advanced code generation and project dependency graph, plus a unified experience for both frontend and backend developers.

Visit [Nx Cloud](https://nx.app/) to learn more.
