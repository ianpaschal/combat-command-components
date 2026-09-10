import ReactMarkdown from 'react-markdown';
import clsx from 'clsx';
import DOMPurify from 'dompurify';

import styles from './MarkdownRenderer.module.scss';

export interface MarkdownRendererProps {
  className?: string;
  content: string;
}

export const MarkdownRenderer = ({
  className,
  content,
}: MarkdownRendererProps): JSX.Element => (
  <div className={clsx(styles.markdownRenderer, className)}>
    <ReactMarkdown>
      {DOMPurify.sanitize(content)}
    </ReactMarkdown>
  </div>
);
