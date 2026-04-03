import { useState } from 'react';

import { InputDateTime, InputDateTimeProps } from '../InputDateTime';

export const ControlledStory = (props: InputDateTimeProps) => {
  const [value, setValue] = useState<Date | undefined>(undefined);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <InputDateTime {...props} value={value} onChange={setValue} />
      <p style={{ margin: 0, fontSize: '0.875rem', opacity: 0.6 }}>
        {value ? `Selected: ${value.toISOString()}` : 'No date selected'}
      </p>
    </div>
  );
};
