# Roadmap

## To Do

- create a dockerfile / compose
- destroy buildings
- add checks (frontend and backend) when building
- more images of buildings and products
- more buildings
  - tailor
  - smithy
- more products
  - apparel
  - tools
- automate creation of cities
  - https://react-spectrum.adobe.com/react-spectrum/getting-started.html
  - add loading spinner
- authentication and authorization
  - guard api routes
  - add token to api request headers
  - get auth state in frontend components
- use redis (nestjs bull) to queue city updates
- pitch idea to René
- fix update city method (see todos in js docstring)
- generated types (gql responses) are really fucked up


## Done

- landing page with mock auth
- add adobe spectrum


## Open Questions

- Every day/hour/tick the current state of each city should be saved to a db, so that we can do macro economic analysis on the data
- What is one round actually?
- Utility buildings that provide e.g. productivity gains for all production sites (e.g. electricity)
- Storage Buildings and a maximum capacity of goods in the city
- When should a building be available to be built by the player? based on just that he construction cost can be paid? or some tech/forschungs mechanism
- 

