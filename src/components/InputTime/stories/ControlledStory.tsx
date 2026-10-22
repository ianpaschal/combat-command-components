import { useState } from 'react';

import { InputTime, InputTimeProps } from '../InputTime';

export const ControlledStory = (props: InputTimeProps) => {
  const [value, setValue] = useState<Date | undefined>(undefined);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <InputTime {...props} value={value} onChange={setValue} />
      <p style={{ margin: 0, fontSize: '0.875rem', opacity: 0.6 }}>
        {value ? `Selected: ${value.toISOString()}` : 'No time selected'}
      </p>
    </div>
  );
};
