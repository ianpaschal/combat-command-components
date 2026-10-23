import { useState } from 'react';

import {
  CurrencyValue,
  InputCurrency,
  InputCurrencyProps,
} from '../InputCurrency';

export const ControlledStory = (props: InputCurrencyProps) => {
  const [value, setValue] = useState<CurrencyValue | undefined>(undefined);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <InputCurrency {...props} value={value} onChange={setValue} />
      <p style={{ margin: 0, fontSize: '0.875rem', opacity: 0.6 }}>
        {value ? `Selected: ${value.amount} (${value.currency})` : 'Nothing entered'}
      </p>
    </div>
  );
};
