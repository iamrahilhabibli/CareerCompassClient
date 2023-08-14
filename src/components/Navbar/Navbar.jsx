import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "../.././Styles/Navbar/Navbar.module.css";
import useUser from "../../customhooks/useUser";
import { useNavigate } from "react-router-dom";
import { useToast } from "@chakra-ui/react";
import cclogolarge from "../../images/cclogolarge.png";
import axios from "axios";
import { HStack, Image } from "@chakra-ui/react";
import { BellIcon, ChatIcon, HamburgerIcon } from "@chakra-ui/icons";
import { useNotifications } from "../../customhooks/useNotifications";
import { useDisclosure } from "@chakra-ui/react";
import { NotificationsDrawer } from "../NotificationsDrawer/NotificationsDrawer";

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
  const hasUnreadNotifications =
    notifications &&
    notifications.some((notification) => notification.readStatus === 1);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  // useEffect(() => {
  //   unreadNotifications?.forEach((notification) => {
  //     toast({
  //       title: "New notification",
  //       position: "top-right",
  //       isClosable: true,
  //       colorScheme: "orange",
  //     });
  //   });
  // }, [unreadNotifications, toast]);
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
            <HStack spacing={6} className={styles.iconContainer}>
              <ChatIcon
                boxSize={6}
                transition="color 0.3s ease"
                _hover={{ color: "#2557a7" }}
                cursor={"pointer"}
              />
              <BellIcon
                boxSize={6}
                transition="color 0.3s ease"
                _hover={{ color: "#2557a7" }}
                cursor={"pointer"}
                onClick={onOpen}
                className={hasUnreadNotifications ? styles.redBell : ""}
              />
              <HamburgerIcon
                boxSize={6}
                cursor={"pointer"}
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
      <NotificationsDrawer
        isOpen={isOpen}
        onClose={onClose}
        notifications={notifications}
      />
    </nav>
  );
}
