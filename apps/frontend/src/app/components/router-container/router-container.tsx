import { Route, Link } from 'react-router-dom';
import LandingPage from '../landing-page/landing-page';
import Accommodation from '../accommodation/accommodation';
import CityOverview from '../city-overview/city-overview';
import ProductionSite from '../production-site/production-site';
import Product from '../product/product';
import GuardedRoute from './guarded-route';
import About from '../about/about';
import { Content } from '@adobe/react-spectrum';

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
      {/* <Route path="/city" exact component={CityOverview} /> */}
      <Route path="/accommodations" exact component={Accommodation} />
      <Route path="/production-sites" exact component={ProductionSite} />
      <Route path="/products" exact component={Product} />
      <Route path="/about" exact component={About} />
    </Content>
  );
};

export default RouterContainer;
