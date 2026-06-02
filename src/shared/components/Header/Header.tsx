import { NavLink } from "react-router-dom";
import styles from "./Header.module.scss";

export function Header() {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>Champions League Draw</h1>

      <nav className={styles.nav}>
        <NavLink to="/fixtures">Fixtures</NavLink>
        <NavLink to="/team-view">Team View</NavLink>
        <NavLink to="/matchday-view">Matchday View</NavLink>
      </nav>
    </header>
  );
}
