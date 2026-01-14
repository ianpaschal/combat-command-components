import { useState } from 'react';

import { Button } from '../../Button';
import {
  Select,
  SelectProps,
  SelectValue,
} from '../Select';

export const ControlledValueStory = (props: SelectProps): JSX.Element => {
  const [value, setValue] = useState<SelectValue | null>(null);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Select
        value={value}
        onChange={setValue}
        {...props}
      />
      <div style={{ fontSize: 14, color: '#666' }}>
        Current value: <strong>{value ?? 'null'}</strong>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <Button text="Set to Cherry" onClick={() => setValue('cherry')} />
        <Button text="Clear" onClick={() => setValue(null)} />
      </div>
    </div>
  );
};
