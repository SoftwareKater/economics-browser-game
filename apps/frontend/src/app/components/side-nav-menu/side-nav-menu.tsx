import '@spectrum-web-components/sidenav/sp-sidenav.js';
import '@spectrum-web-components/sidenav/sp-sidenav-heading.js';
import '@spectrum-web-components/sidenav/sp-sidenav-item.js';
import { DOMAttributes } from 'react';

type CustomElement<T> = Partial<T & DOMAttributes<T> & { children: unknown }>;

/**
 * This is to make typescript recognise the web component
 * https://coryrylan.com/blog/how-to-use-web-components-with-typescript-and-react
 */
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ['sp-sidenav']: CustomElement<any>;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ['sp-sidenav-item']: CustomElement<any>;
    }
  }
}

/**
 * Side navigation menu
 * @returns
 */
export const SideNavMenu = () => {
  return (
    <sp-sidenav defaultValue="Home">
      <sp-sidenav-item value="Home" href="/home">
        Home
      </sp-sidenav-item>
      <sp-sidenav-item value="City" href="/city">
        City
      </sp-sidenav-item>
      <sp-sidenav-item value="Accommodations" href="/accommodations">
        Accommodations
      </sp-sidenav-item>
      <sp-sidenav-item value="Production Sites" href="/production-sites">
        Production Sites
      </sp-sidenav-item>
      <sp-sidenav-item value="Products" href="/products" target="_blank">
        Products
      </sp-sidenav-item>
      <sp-sidenav-item value="About" href="/about">
        About
      </sp-sidenav-item>
    </sp-sidenav>
  );
};

export default SideNavMenu;
