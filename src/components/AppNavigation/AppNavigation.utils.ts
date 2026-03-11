export const locationToAncestorPaths = (location: string): string[] => (
  location.split('/').slice(1).reduce<string[]>((acc, segment) => [
    ...acc,
    `${acc[acc.length - 1] ?? ''}/${segment}`,
  ], [])
);
