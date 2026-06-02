import { useState } from "react";
import styles from "./MatchdayViewPage.module.scss";

import { useMatches } from "../../hooks/useMatches";
import { MatchTable } from "../../components/MatchTable";
import { LoadingState } from "../../../../shared/components/LoadingState";
import { ErrorState } from "../../../../shared/components/ErrorState";
import { EmptyState } from "../../../../shared/components/EmptyState";

export function MatchdayViewPage() {
  const [selectedMatchday, setSelectedMatchday] = useState("1");

  const { data, isLoading, isError } = useMatches({
    page: 1,
    limit: 100,
    matchDay: Number(selectedMatchday),
  });

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState />;

  const matches = data?.matches ?? [];

  return (
    <section className={styles.container}>
      <div className={styles.header}>
        <h2>Matchday Fixtures</h2>
        <p>Explore all fixtures scheduled for a specific matchday.</p>
      </div>

      <div className={styles.days}>
        {Array.from({ length: 8 }, (_, index) => {
          const day = String(index + 1);

          return (
            <button
              key={day}
              className={selectedMatchday === day ? styles.active : ""}
              onClick={() => setSelectedMatchday(day)}
            >
              Match Day {day}
            </button>
          );
        })}
      </div>

      {matches.length ? <MatchTable matches={matches} /> : <EmptyState />}
    </section>
  );
}
