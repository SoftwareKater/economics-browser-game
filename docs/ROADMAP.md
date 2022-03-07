# Roadmap

## To Do

### MVP
- remove tailwind which is superfluous when using adobe spectrum
- create a dockerfile / compose
- imporve views
  - habitants
  - accommodations
  - production-sites
- destroy buildings
- add the market
  - add view/form for placing an offer
  - add view/form for placing a bid
  - add market clearing algorithm
- add endpoint to dis-/allow products
- habitants nutrition
  - add nutrition values to consumable products
  - add habitants nutrition to city update loop
  - add the starving mechanism
- habitants utility function
- firms production function
- accommodations maintenance costs
  - if not paid, the accommodation must be abandoned
  - all residents must find a new accommodation
- add the government
  - add the newspaper view where government requests are placed
  - add an admin endpoint to create government requests
- add checks (frontend and backend) for building city buildings
  - only show buildings that are constructed using resources that the player has
  - ...
- more images of buildings and products, default image when none available
- add more production-sites and products
  - brickyard, clay, brick
  - ...
- add more housing
  - brick house
  - ...
- authentication and authorization
  - guard api routes
  - add token to api request headers
  - get auth state in frontend components
- automatic city updates
- fix update city method (see todos in js docstring)
- generated types (gql responses) are really f***ed up
- auth
  - hash passwords before writing to db
  - validate jwts

### Future

- Utility buildings
  - may provide productivity gains for all production sites (e.g. power plant)
  - may provide productivity gains for all habitants (e.g. theater)
- Storage Buildings
  - provide room to store the goods that are produced
- Technology Mechanism
  - buildings need to be research before they can be built

## Done

- landing page with mock auth
- add adobe spectrum
- automate creation of cities


## Open Questions

- Every day/hour/tick the current state of each city should be saved to a db, so that we can do macro economic analysis on the data
- What is one round/tick actually?
