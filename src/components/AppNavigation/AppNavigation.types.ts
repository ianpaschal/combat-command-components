import { ReactElement } from 'react';

export type Route = {
  title: string;
  path: string;
  icon?: ReactElement;
  children?: Route[];
};

export type SecondaryRoute = Omit<Route, 'children'>;
