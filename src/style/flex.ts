import { CSSAttribute } from 'goober';

export function row(
  config: {
    gap?: string;
    xAlign?: 'start' | 'center' | 'end';
    yAlign?: 'start' | 'center' | 'end';
    reverse?: boolean;
  },
): CSSAttribute {
  return {
    display: 'flex',
    flexDirection: config?.reverse ? 'row-reverse' : 'row',
    gap: config?.gap ?? '1rem',
    justifyContent: config?.xAlign ?? 'start',
    alignItems: config?.yAlign ?? 'center',
  };
}

export function column(
  config?: {
    gap?: string;
    xAlign?: 'start' | 'center' | 'end';
    yAlign?: 'start' | 'center' | 'end';
    reverse?: boolean;
  },
): CSSAttribute {
  return {
    display: 'flex',
    flexDirection: config?.reverse ? 'row-reverse' : 'row',
    gap: config?.gap ?? '1rem',
    justifyContent: config?.yAlign ?? 'start',
    alignItems: config?.xAlign ?? 'center',
  };
}
