import {
  ChangeEvent,
  forwardRef,
  ReactElement,
  useState,
} from 'react';
import clsx from 'clsx';

import { getCalculatorCaretProps } from '../../utils/getCalculatorCaretProps';
import { parseCalculatorDigits } from '../../utils/parseCalculatorDigits';
import { InputMasked, InputMaskedProps } from '../InputMasked';
import {
  Select,
  SelectOption,
  SelectValue,
} from '../Select';
import { CURRENCY_OPTIONS } from './InputCurrency.constants';
import {
  getAmountDigits,
  getAmountFromDigits,
  getAmountParts,
  MAX_DIGITS,
} from './InputCurrency.utils';

import styles from './InputCurrency.module.scss';

export type CurrencyValue = {

  /** The amount in the currency's smallest unit (e.g. cents). */
  amount: number;
  currency: string;
};

export interface InputCurrencyProps extends Omit<InputMaskedProps,
  'defaultValue' |
  'icon' |
  'inputMode' |
  'mask' |
  'maskDescription' |
  'onChange' |
  'placeholder' |
  'type' |
  'value'
> {

  /** The currencies which can be chosen. */
  currencies?: SelectOption[];

  /** How many digits are after the separator. Use 0 for currencies without a fraction (e.g. yen). */
  decimals?: number;
  defaultValue?: CurrencyValue;
  onChange?: (value: CurrencyValue) => void;
  value?: CurrencyValue;
}

export const InputCurrency = forwardRef<HTMLInputElement, InputCurrencyProps>(({
  border = true,
  className,
  corners = 'normal',
  currencies = CURRENCY_OPTIONS,
  decimals = 2,
  defaultValue,
  disabled,
  intent = 'secondary',
  loading = false,
  onChange,
  value,
  variant = 'ghost',
  ...props
}, ref): ReactElement => {
  const caretProps = getCalculatorCaretProps(props);
  const [internalValue, setInternalValue] = useState(defaultValue);
  const current = value ?? internalValue;
  const amount = current?.amount ?? 0;
  const currency = current?.currency ?? `${currencies[0]?.value ?? ''}`;

  const commit = (next: CurrencyValue): void => {
    setInternalValue(next);
    onChange?.(next);
  };

  const handleAmountChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const digits = parseCalculatorDigits(e.target.value, MAX_DIGITS);
    commit({ amount: getAmountFromDigits(digits), currency });
  };

  const handleCurrencyChange = (next: SelectValue | null): void => {
    if (next !== null) {
      commit({ amount, currency: `${next}` });
    }
  };

  const { fraction, integer } = getAmountParts(getAmountDigits(amount), decimals);
  const amountText = decimals > 0 ? `${integer}.${fraction}` : integer;

  return (
    <div className={clsx(styles.inputCurrency, className)}>
      <Select
        border={border}
        className={styles.inputCurrencySelect}
        disabled={loading || disabled}
        intent={intent}
        options={currencies}
        value={currency}
        variant={variant}
        onChange={handleCurrencyChange}
      />
      <InputMasked
        {...props}
        align="end"
        ref={ref}
        border={border}
        className={styles.inputCurrencyField}
        corners={corners}
        disabled={disabled}
        inputMode="numeric"
        intent={intent}
        loading={loading}
        mask={() => {
          let significant = false;
          const renderGroup = (digits: string): ReactElement => (
            <span className={styles.inputCurrencyGroup}>
              {digits.split('').map((digit, i) => {
                significant = significant || digit !== '0';
                return (
                  <span
                    key={i}
                    className={styles.inputCurrencyDigit}
                    data-leading-zero={!significant || undefined}
                  >
                    {digit}
                  </span>
                );
              })}
            </span>
          );
          return (
            <>
              {renderGroup(integer)}
              {decimals > 0 && (
                <>
                  <span>.</span>
                  {renderGroup(fraction)}
                </>
              )}
            </>
          );
        }}
        maskDescription={`${amountText} ${currency.toUpperCase()}`}
        type="text"
        value={getAmountDigits(amount)}
        variant={variant}
        onChange={handleAmountChange}
        {...caretProps}
      />
    </div>
  );
});

InputCurrency.displayName = 'InputCurrency';
