import { Route } from './AppNavigation.types';

export const locationToAncestorPaths = (location: string): string[] => (
  location.split('?')[0].split('/').slice(1).reduce<string[]>((acc, segment) => [
    ...acc,
    `${acc[acc.length - 1] ?? ''}/${segment}`,
  ], [])
);

export const defaultNavigate = (route: Omit<Route, 'title'>): void => {
  if (route.target === '_blank') {
    window.open(route.path, '_blank', 'noopener,noreferrer');
    return;
  }
  if (route.target === '_self') {
    window.location.href = route.path;
    return;
  }
};
