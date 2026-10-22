import { SelectOption } from '../Select';

// Copied from `getCurrencyOptions()` in combat-command-game-systems (euro first as most widely used)
export const CURRENCY_OPTIONS: SelectOption[] = [
  { label: 'EUR', value: 'eur' },
  { label: 'AUD', value: 'aud' },
  { label: 'CAD', value: 'cad' },
  { label: 'CHF', value: 'chf' },
  { label: 'DKK', value: 'dkk' },
  { label: 'GBP', value: 'gbp' },
  { label: 'NOK', value: 'nok' },
  { label: 'NZD', value: 'nzd' },
  { label: 'SEK', value: 'sek' },
  { label: 'USD', value: 'usd' },
];
