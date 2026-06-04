import { ReactElement } from 'react';

export type Route = {
  title: string;
  path: string;
  icon?: ReactElement;
  external?: boolean;
  children?: Route[];
};

export type SecondaryRoute = Omit<Route, 'children'>;
