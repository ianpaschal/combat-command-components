export const brandPrimary = (): string => 'hsl(10, 100%, 60%)';

export const brandSecondary = (l: number): string => (
  `hsl(220, 22.5%, ${Math.max(Math.min(l, 100), 0)}%)`
);
