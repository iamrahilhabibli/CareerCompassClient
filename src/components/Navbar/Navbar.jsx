import React from "react";
import { Link } from "react-router-dom";
import styles from "../.././Styles/Navbar/Navbar.module.css";
export function Navbar() {
  return (
    <nav>
      <div className={styles.navbarLeftSide}>
        <div></div>
        <div className={styles.navbarComponents}>
          <Link to="/">Find jobs</Link>
          <Link to="/companies">Company Reviews</Link>
          <Link to="/findsalaries">Find Salaries</Link>
        </div>
      </div>
    </nav>
  );
}
