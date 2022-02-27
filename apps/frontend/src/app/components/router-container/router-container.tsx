import { Route, Link } from 'react-router-dom';
import LandingPage from '../landing-page/landing-page';
import Accommodation from '../accommodation/accommodation';
import CityOverview from '../city-overview/city-overview';
import ProductionSite from '../production-site/production-site';
import Product from '../product/product';
import GuardedRoute from './guarded-route';
import HabitantsOverview from '../habitants-overview/habitants-overview';

/**
 * Router Outlet
 * @todo guard routes
 * @returns
 */
const RouterContainer = () => {
  const isAutheticated = false;

  return (
    <div>
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
      <Route path="/products" exact component={Product} />
    </div>
  );
};

export default RouterContainer;
