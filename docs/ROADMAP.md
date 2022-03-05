# Roadmap

## To Do

### MVP
- create a dockerfile / compose
- destroy buildings
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
