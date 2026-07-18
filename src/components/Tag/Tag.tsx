import {
  AnchorHTMLAttributes,
  forwardRef,
  Ref,
} from 'react';
import clsx from 'clsx';
import { X } from 'lucide-react';

import { getStyleClassNames } from '../../utils/getStyleClassNames';
import { ButtonProps } from '../Button';

import styles from './Tag.module.scss';

export interface TagProps extends Omit<ButtonProps, 'align' | 'collapsePadding' | 'iconPosition' | 'loading'> {
  corners?: boolean | 'tight' | 'normal' | 'wide';
  onRemove?: () => void;
}

export const Tag = forwardRef<HTMLSpanElement | HTMLAnchorElement, TagProps>(({
  border = false,
  className,
  corners = 'normal',
  href,
  icon,
  intent = 'secondary',
  onClick,
  onRemove,
  rel,
  size = 'normal',
  target,
  text,
  variant = 'solid',
  rounded,
  ...props
}, ref): JSX.Element => {
  const resolvedClassName = clsx(getStyleClassNames({
    border,
    corners,
    intent,
    variant,
  }), styles.tag, className);

  const content = (
    <>
      {icon && (
        <span className={styles.tagIcon}>{icon}</span>
      )}
      {text && (
        <span>{text}</span>
      )}
      {onRemove && (
        <button
          type="button"
          className={styles.tagRemove}
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          aria-label="Remove"
        >
          <X />
        </button>
      )}
    </>
  );

  if (href != null) {
    return (
      <a
        ref={ref as Ref<HTMLAnchorElement>}
        className={resolvedClassName}
        data-size={size}
        data-rounded={rounded || undefined}
        href={href}
        rel={rel}
        target={target}
        {...(props as AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {content}
      </a>
    );
  }

  return (
    <span
      ref={ref as Ref<HTMLSpanElement>}
      className={resolvedClassName}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      data-size={size}
      data-rounded={rounded || undefined}
      onClick={onClick}
      {...props}
    >
      {content}
    </span>
  );
});

Tag.displayName = 'Tag';
