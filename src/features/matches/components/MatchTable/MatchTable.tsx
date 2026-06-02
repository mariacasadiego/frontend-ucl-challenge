import type { Match } from "../../types/match";
import styles from "./MatchTable.module.scss";

interface MatchTableProps {
  matches: Match[];
}

export function MatchTable({ matches }: MatchTableProps) {
  return (
    <div className={styles.container}>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Match Day</th>
              <th>Home Team</th>
              <th>Home Country</th>
              <th>Away Team</th>
              <th>Away Country</th>
            </tr>
          </thead>

          <tbody>
            {matches.map((match) => (
              <tr key={match.id}>
                <td>{match.matchDay}</td>
                <td>{match.homeTeam.name}</td>
                <td>{match.homeTeam.country.name}</td>
                <td>{match.awayTeam.name}</td>
                <td>{match.awayTeam.country.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.cardList}>
        {matches.map((match) => (
          <article key={match.id} className={styles.card}>
            <span className={styles.matchday}>Match Day {match.matchDay}</span>

            <div className={styles.teams}>
              <div className={styles.team}>
                <span className={styles.label}>Home</span>
                <strong>{match.homeTeam.name}</strong>
                <p>{match.homeTeam.country.name}</p>
              </div>

              <span className={styles.vs}>vs</span>

              <div className={styles.team}>
                <span className={styles.label}>Away</span>
                <strong>{match.awayTeam.name}</strong>
                <p>{match.awayTeam.country.name}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
