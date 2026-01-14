import styles from './UserOption.module.scss';

interface UserOptionProps {
  user?: {
    name: string;
  };
  placeholder?: string;
}

export const UserOption = ({
  placeholder,
  user,
}: UserOptionProps): JSX.Element => (
  <div className={styles.userOption}>
    {user ? (
      <img
        className={styles.userOptionAvatar}
        src={`https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${user.name}&scale=75`}
      />
    ) : (
      <div
        className={styles.userOptionAvatar}
        style={{ backgroundColor: '#EEE' }}
      />
    )}
    <span>{user?.name ?? placeholder}</span>
  </div>
);
