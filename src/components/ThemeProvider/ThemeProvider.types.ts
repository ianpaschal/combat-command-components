import { ElementIntent } from '../../types';

export type IntentColors = {
  bg: string;
  text: string;
  focus: string;
};

export type Theme = {
  key: string;
  displayName: string;
  overlayStrength: number;
  shadowStrength: number;
  intents: Record<ElementIntent, IntentColors>;
  surface: {
    page: {
      bg: string;
    };
    card: {
      bg: string;
      border: string;
    };
  };
  text: {
    header: string;
    body: string;
    ui: string;
  };
};
