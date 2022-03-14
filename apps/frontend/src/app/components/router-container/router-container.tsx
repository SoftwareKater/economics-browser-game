import { Route, Link } from 'react-router-dom';
import LandingPage from '../landing-page/landing-page';
import Accommodation from '../accommodation/accommodation';
import CityOverview from '../city-overview/city-overview';
import ProductionSite from '../production-site/production-site';
import CityProducts from '../city-products/city-products';
import GuardedRoute from './guarded-route';
import HabitantsOverview from '../habitants-overview/habitants-overview';
import About from '../about/about';
import { Content } from '@adobe/react-spectrum';
import PlaceOffer from '../place-offer/place-offer';
import { ROUTES } from './routes';

/**
 * Router Outlet
 * @todo guard routes
 * @returns
 */
const RouterContainer = () => {
  const isAutheticated = false;

  return (
    <Content>
      <Route path="/home" exact component={LandingPage} />
      <GuardedRoute
        path="/city"
        component={CityOverview}
        auth
        {...isAutheticated}
      />
      <Route path="/habitants" exact component={HabitantsOverview} />
      <Route path="/accommodations" exact component={Accommodation} />
      <Route path="/production-sites" exact component={ProductionSite} />
      <Route path="/products" exact component={CityProducts} />
      <Route path="/place-offer" exact component={PlaceOffer} />
      <Route path="/about" exact component={About} />
    </Content>
  );
};

export default RouterContainer;
