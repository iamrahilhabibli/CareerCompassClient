import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "../.././Styles/Navbar/Navbar.module.css";
import useUser from "../../customhooks/useUser";
import { useNavigate } from "react-router-dom";
import cclogolarge from "../../images/cclogolarge.png";
import axios from "axios";
import { HStack, Image } from "@chakra-ui/react";
import { BellIcon, ChatIcon, HamburgerIcon } from "@chakra-ui/icons";
import { useNotifications } from "../../customhooks/useNotifications";
export function Navbar() {
  const { isAuthenticated, userId } = useUser();
  const token = localStorage.getItem("token");
  const { data: notifications, isLoading } = useNotifications(userId, token);
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
            <HStack spacing={5} className={styles.iconContainer}>
              <ChatIcon
                boxSize={5}
                transition="color 0.3s ease"
                _hover={{ color: "#2557a7" }}
              />
              <BellIcon
                boxSize={5}
                transition="color 0.3s ease"
                _hover={{ color: "#2557a7" }}
              />
              <HamburgerIcon
                boxSize={5}
                transition="color 0.3s ease"
                _hover={{ color: "#2557a7" }}
              />
            </HStack>
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
