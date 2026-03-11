import { useCallback } from 'react';

export const useAppNavigate = (navigate: (path: string) => void) => useCallback((path: string) => {
  if (path.startsWith('/')) {
    navigate(path);
  } else {
    window.open(path, '_blank', 'noopener,noreferrer');
  }
}, [navigate]);
