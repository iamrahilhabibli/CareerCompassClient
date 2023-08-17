import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./Navbar.module.css";
import useUser from "../../customhooks/useUser";
import { useNavigate } from "react-router-dom";
import { useToast } from "@chakra-ui/react";
import cclogolarge from "../../images/cclogolarge.png";
import { HStack, Image } from "@chakra-ui/react";
import { BellIcon, ChatIcon } from "@chakra-ui/icons";
import { useNotifications } from "../../customhooks/useNotifications";
import { useDisclosure } from "@chakra-ui/react";
import { NotificationsDrawer } from "../NotificationsDrawer/NotificationsDrawer";
import { Menu } from "../Menu/Menu";
import { fetchRecruiterDetails } from "../../services/fetchRecruiterDetails";

export function Navbar() {
  const { isAuthenticated, userId, userRole } = useUser();
  const token = localStorage.getItem("token");
  const { data: notificationsFromAPI, isLoading } = useNotifications(
    userId,
    token
  );
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [initialLoad, setInitialLoad] = useState(true);

  const handlePostJobClick = (event) => {
    if (!isAuthenticated) {
      console.log("navigating");
      event.preventDefault();
      navigate("/signin");
      return;
    }
    if (userRole === "Recruiter" && userId && token) {
      fetchRecruiterDetails(userId, token).then((recruiter) => {
        if (recruiter && recruiter.companyId === null) {
          toast({
            title: "Company Details Required",
            description:
              "Please register your company details before posting a job.",
            status: "error",
            position: "top-right",
            duration: 1000,
            isClosable: true,
          });
        } else {
          navigate("/employerscareercompass");
        }
      });
    }
  };

  useEffect(() => {
    if (
      !initialLoad &&
      notificationsFromAPI &&
      notificationsFromAPI.length > (notifications ? notifications.length : 0)
    ) {
      toast({
        title: "New Notification!",
        description: "You have received a new notification.",
        status: "info",
        position: "top-right",
        duration: 1000,
        isClosable: true,
      });
    }
    if (notificationsFromAPI) {
      setNotifications(notificationsFromAPI);
      if (initialLoad) setInitialLoad(false);
    }
  }, [notificationsFromAPI, notifications, toast, initialLoad]);

  const hasUnreadNotifications =
    notifications &&
    notifications.some((notification) => notification.readStatus === 1);

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
              <Menu />
            </HStack>
          ) : (
            <Link className={styles.signIn} to="/signin">
              Sign in
            </Link>
          )}
          <span className={styles.divider}></span>
          <Link to="#" onClick={handlePostJobClick}>
            Employers/Post Job
          </Link>
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
