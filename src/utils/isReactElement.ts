import { isValidElement, ReactElement } from 'react';

export const isReactElement = (value: unknown): value is ReactElement => isValidElement(value);
