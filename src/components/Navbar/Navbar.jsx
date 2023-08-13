import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "../.././Styles/Navbar/Navbar.module.css";
import useUser from "../../customhooks/useUser";

export function Navbar() {
  const { isAuthenticated, userId, email, userRole } = useUser();

  useEffect(() => {}, [isAuthenticated]);
  return (
    <nav>
      <div className={styles.navbarLeftSide}>
        <div></div>
        <div className={styles.navbarComponentsLeft}>
          <Link to="/">Find jobs</Link>
          <Link to="/companies">Company Reviews</Link>
          <Link to="/findsalaries">Find Salaries</Link>
        </div>
      </div>
      <div className={styles.navbarRightSide}>
        <div className={styles.navbarComponentsRight}>
          {isAuthenticated ? (
            <Link className={styles.signIn} to="/signin">
              Sign out
            </Link>
          ) : (
            <Link className={styles.signIn} to="/signin">
              Sign in
            </Link>
          )}
          <span className={styles.divider}></span>
          <Link to="/employers">Employers/Post Job</Link>
        </div>
      </div>
    </nav>
  );
}
