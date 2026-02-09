import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export const useAppNavigate = () => {
  const navigate = useNavigate();
  return useCallback((path: string) => {
    if (path.startsWith('/')) {
      navigate(path);
    } else {
      window.open(path, '_blank', 'noopener,noreferrer');
    }
  }, [navigate]);
};
