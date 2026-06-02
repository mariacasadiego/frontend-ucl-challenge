import styles from "./EmptyState.module.scss";

interface EmptyStateProps {
  message?: string;
}

export function EmptyState({
  message = "No matches found. Try adjusting your filters.",
}: EmptyStateProps) {
  return (
    <div className={styles.container}>
      <div className={styles.icon}>🔍</div>
      <h3>{message}</h3>
    </div>
  );
}
