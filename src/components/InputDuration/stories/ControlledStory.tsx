import { useState } from 'react';

import { InputDuration, InputDurationProps } from '../InputDuration';

export const ControlledStory = (props: InputDurationProps) => {
  const [value, setValue] = useState<number | undefined>(undefined);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <InputDuration {...props} value={value} onChange={setValue} />
      <p style={{ margin: 0, fontSize: '0.875rem', opacity: 0.6 }}>
        {value !== undefined ? `Selected: ${value} ms` : 'No duration selected'}
      </p>
    </div>
  );
};
