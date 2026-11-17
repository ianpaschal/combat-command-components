import {
  ChangeEvent,
  DragEvent,
  KeyboardEvent,
  ReactElement,
  useRef,
  useState,
} from 'react';
import {
  FileText,
  Upload,
  X,
} from 'lucide-react';

import {
  ElementCorners,
  ElementIntent,
  ElementVariant,
} from '../../types';
import { sx } from '../../utils';
import { Button } from '../Button';
import { Spinner } from '../Spinner';

import styles from './InputFile.module.scss';

export interface InputFileValue {
  name: string;
}

export interface InputFileProps {
  accept?: string[];
  border?: boolean;
  className?: string;
  corners?: boolean | ElementCorners;
  disabled?: boolean;
  id?: string;
  intent?: ElementIntent;
  loading?: boolean;
  onChange?: (file: File | null) => void;
  placeholder?: string;
  value?: InputFileValue | null;
  variant?: ElementVariant;
}

const isAccepted = (file: File, accept: string[]): boolean => {
  if (!accept.length) {
    return true;
  }
  const fileName = file.name.toLowerCase();
  return accept.some((pattern) => {
    const p = pattern.trim().toLowerCase();
    if (p.startsWith('.')) {
      return fileName.endsWith(p);
    }
    if (p.endsWith('/*')) {
      return file.type.startsWith(p.slice(0, -1));
    }
    return file.type === p;
  });
};

/**
 * Lets the user pick or drop a single file, and shows the current value's name.
 *
 * @remarks
 * The component holds no file state of its own. It reports the chosen `File`
 * through `onChange`, and displays whatever `value` it is given, so the parent
 * decides how a file is stored (e.g. uploading it and keeping only an ID).
 */
export const InputFile = ({
  accept = [],
  border = true,
  className,
  corners = 'normal',
  disabled = false,
  id,
  intent = 'secondary',
  loading = false,
  onChange,
  placeholder ='Drop a file here, or click to browse.',
  value,
  variant = 'ghost',
}: InputFileProps): ReactElement => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const inactive = disabled || loading;

  const handleFiles = (files: FileList | null): void => {
    const file = files?.[0];
    if (file && isAccepted(file, accept)) {
      onChange?.(file);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    handleFiles(e.target.files);
    e.target.value = '';
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>): void => {
    if (inactive || !e.dataTransfer.types.includes('Files')) {
      return;
    }
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    setDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>): void => {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
      setDragging(false);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setDragging(false);
    if (!inactive) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const openPicker = (): void => inputRef.current?.click();

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>): void => {
    if (!inactive && e.target === e.currentTarget && ['Enter', ' '].includes(e.key)) {
      e.preventDefault();
      openPicker();
    }
  };

  return (
    <div
      className={sx({
        corners,
        intent,
        variant,
        border,
      }, styles.inputFile, className)}
      data-dragging={dragging || undefined}
      data-disabled={inactive || undefined}
      role="button"
      tabIndex={inactive ? -1 : 0}
      aria-disabled={inactive || undefined}
      onClick={(e) => !inactive && e.target !== inputRef.current && openPicker()}
      onKeyDown={handleKeyDown}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className={styles.inputFilePreview}>
        {loading ? (
          <Spinner size={32} />
        ) : value ? (
          <FileText className={styles.inputFileIcon} />
        ) : (
          <Upload className={styles.inputFileIcon} />
        )}
      </div>
      <div className={styles.inputFileLabel}>
        <span className={styles.inputFileLabelText} data-placeholder={!value || undefined}>
          {value?.name ?? placeholder}
        </span>
        {value && (
          <Button
            aria-label="Remove file"
            icon={<X />}
            size="small"
            variant="ghost"
            disabled={inactive}
            onClick={(e) => {
              e.stopPropagation();
              onChange?.(null);
            }}
          />
        )}
      </div>
      <input
        ref={inputRef}
        id={id}
        type="file"
        accept={accept.join(',')}
        disabled={inactive}
        onChange={handleInputChange}
        hidden
      />
    </div>
  );
};
