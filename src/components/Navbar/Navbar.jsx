import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./Navbar.module.css";
import useUser from "../../customhooks/useUser";
import { useNavigate } from "react-router-dom";
import compassLogo from "../../images/compassLogo.jpeg";
import {
  Box,
  Divider,
  Flex,
  IconButton,
  Spinner,
  useBreakpointValue,
  useToast,
} from "@chakra-ui/react";
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
      event.preventDefault();
      navigate("/signin");
      return;
    }
    if (userRole === "JobSeeker") {
      toast({
        title: "Access Restricted",
        description:
          "This section is for recruiters only. Please contact support if you need assistance.",
        status: "warning",
        position: "top-right",
        duration: 3000,
        isClosable: true,
      });
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
  const handleAdminClick = (event) => {
    if (!isAuthenticated) {
      event.preventDefault();
      navigate("/signin");
    }
    navigate("/dashboard");
  };
  const redirectToMessages = () => {
    navigate("/jsmessages");
  };
  const redirectToRecruiterMessages = () => {
    navigate("/messages");
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

  const isResponsiveMenu = useBreakpointValue({ base: true, md: false });
  return (
    <Flex as="nav" align="center" justify="space-between" px={4} py={2}>
      <Flex align="center">
        <Link to="/">
          <Image boxSize="80px" src={compassLogo} alt="Logo" />
        </Link>
        <HStack spacing={4} display={{ base: "none", md: "flex" }}>
          <Link
            to="/home"
            _hover={{ color: "#2557a7", textDecoration: "underline" }}
          >
            Find jobs
          </Link>
          <Link
            to="/companies"
            _hover={{ color: "#2557a7", textDecoration: "underline" }}
          >
            Company Reviews
          </Link>
          <Link
            to="/pricing"
            _hover={{ color: "#2557a7", textDecoration: "underline" }}
          >
            Pricing
          </Link>
          <Link
            to="/aboutus"
            _hover={{ color: "#2557a7", textDecoration: "underline" }}
          >
            About us
          </Link>
        </HStack>
      </Flex>
      <Flex align="center">
        {isAuthenticated ? (
          <HStack spacing={4}>
            <IconButton
              icon={<ChatIcon boxSize="4" />}
              onClick={() => {
                userRole === "Recruiter"
                  ? redirectToRecruiterMessages()
                  : redirectToMessages();
              }}
              _hover={{ color: "#2557a7" }}
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
          <Link _hover={{ color: "#2557a7" }} to="/signin">
            Sign in
          </Link>
        )}
        <Divider orientation="vertical" height="20px" />
        {isAuthenticated && userRole !== "JobSeeker" && (
          <Link
            to={
              userRole === "Master" || userRole === "Admin" ? "/dashboard" : "#"
            }
            onClick={
              userRole === "Master" || userRole === "Admin"
                ? handleAdminClick
                : handlePostJobClick
            }
          >
            {userRole === "Master" || userRole === "Admin"
              ? "Admin Dashboard"
              : "Employers/Post Job"}
          </Link>
        )}
      </Flex>

      <NotificationsDrawer
        isOpen={isOpen}
        onClose={onClose}
        notifications={notifications}
      />
    </Flex>
  );
}
