import styles from "./ErrorState.module.scss";

interface ErrorStateProps {
  message?: string;
}

export function ErrorState({
  message = "Unable to load fixtures.",
}: ErrorStateProps) {
  return (
    <div className={styles.container}>
      <div className={styles.icon}>⚠️</div>

      <h3>Something went wrong</h3>

      <p>{message}</p>
    </div>
  );
}
