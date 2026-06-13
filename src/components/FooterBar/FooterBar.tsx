import {
  ReactElement,
  ReactNode,
  useEffect,
  useRef,
} from 'react';
import { createPortal } from 'react-dom';
import clsx from 'clsx';

import { getStyleClassNames } from '../../utils/getStyleClassNames';

import styles from './FooterBar.module.scss';

export interface FooterBarProps {
  children?: ReactNode;
  className?: string;
  maxWidth?: number | string;
  mobile?: boolean;
  portalTarget?: Element;
}

export const FooterBar = ({
  children,
  className,
  maxWidth = '100vw',
  mobile = false,
  portalTarget = document.body,
}: FooterBarProps): ReactElement => {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const content = contentRef.current;
    if (!content) {
      return;
    }
    const observer = new ResizeObserver(([entry]) => {
      const height = entry.borderBoxSize?.[0]?.blockSize ?? entry.target.getBoundingClientRect().height;
      document.documentElement.style.setProperty('--footer-bar-height', `${height}px`);
    });
    observer.observe(content);
    return () => {
      observer.disconnect();
      document.documentElement.style.removeProperty('--footer-bar-height');
    };
  }, []);

  return createPortal((
    <div
      className={clsx(styles.footerBar, ...getStyleClassNames({
        variant: 'surface',
        border: 'top',
      }), className)}

    >
      <div ref={contentRef} className={styles.footerBarContent} style={{ maxWidth }} data-mobile={mobile || undefined}>
        {children}
      </div>
    </div>
  ), portalTarget);
};
