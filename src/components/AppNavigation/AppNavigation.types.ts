import { ReactElement } from 'react';

export type Route = {
  title: string;
  path: string;
  icon?: ReactElement;
  target?: '_blank' | '_self';
  children?: Route[];
};

export type SecondaryRoute = Omit<Route, 'children'>;
export type LogoRoute = Omit<Route, 'title'>;
