import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "../.././Styles/Navbar/Navbar.module.css";
import useUser from "../../customhooks/useUser";
import { useNavigate } from "react-router-dom";
import cclogolarge from "../../images/cclogolarge.png";
import axios from "axios";
import { Image } from "@chakra-ui/react";

export function Navbar() {
  const { isAuthenticated, userId, email, userRole } = useUser();
  const navigate = useNavigate();
  const handleLogout = () => {
    const token = localStorage.getItem("token");
    axios
      .post("https://localhost:7013/api/Accounts/Logout", null, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        localStorage.removeItem("token");
        window.dispatchEvent(new Event("storage"));
        navigate("/");
      })
      .catch((error) => {
        console.error("An error occurred during logout:", error);
      });
  };

  useEffect(() => {}, [isAuthenticated]);
  return (
    <nav>
      <div className={styles.navbarLeftSide}>
        <Link to="/">
          <Image className={styles.navbarLogo} src={cclogolarge} alt="Logo" />
        </Link>
        <div className={styles.navbarComponentsLeft}>
          <Link to="/">Find jobs</Link>
          <Link to="/companies">Company Reviews</Link>
          <Link to="/findsalaries">Find Salaries</Link>
        </div>
      </div>
      <div className={styles.navbarRightSide}>
        <div className={styles.navbarComponentsRight}>
          {isAuthenticated ? (
            <Link className={styles.signIn} onClick={handleLogout}>
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
