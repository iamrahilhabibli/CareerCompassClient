import {
  DrawerBody,
  DrawerHeader,
  DrawerContent,
  DrawerOverlay,
  Drawer,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  Box,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import styles from "./NotificationDrawer.module.css";
import axios from "axios";
import { BellIcon } from "@chakra-ui/icons";

export function NotificationsDrawer({ isOpen, onClose, notifications }) {
  const [localNotifications, setLocalNotifications] = useState(notifications);
  const placement = "right";
  const token = localStorage.getItem("token");
  const unreadNotifications = notifications?.filter(
    (notification) => notification.readStatus === 1
  );

  useEffect(() => {
    setLocalNotifications(notifications);
  }, [notifications]);

  const offset = new Date().getTimezoneOffset() * 60000;
  const markAsRead = (notificationId) => {
    axios
      .post(
        `https://localhost:7013/api/Notifications/MarkNotificationAsRead/${notificationId}`,
        null,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(() => {
        setLocalNotifications(
          localNotifications.map((notification) => {
            if (notification.id === notificationId) {
              return { ...notification, readStatus: 0 };
            }
            return notification;
          })
        );
      })
      .catch((error) => {
        console.error("An error occurred:", error);
      });
  };

  return (
    <Drawer placement={placement} onClose={onClose} isOpen={isOpen}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerHeader borderBottomWidth="1px" textAlign={"center"}>
          Notifications
        </DrawerHeader>
        <DrawerBody>
          {unreadNotifications?.length > 0 ? (
            <Accordion allowMultiple>
              {unreadNotifications.map((notification) => {
                const localDate = new Date(
                  new Date(notification.dateCreated).getTime() - offset
                );

                return (
                  <AccordionItem
                    key={notification.id}
                    onClick={() => markAsRead(notification.id)}
                    title="Click to mark as read"
                  >
                    <AccordionButton
                      className={`${
                        notification.readStatus === 1 ? styles.unread : ""
                      }`}
                    >
                      <Box flex="1" textAlign="left">
                        {notification.title}
                      </Box>
                    </AccordionButton>
                    <AccordionPanel>
                      <div className={styles.notificationMessage}>
                        <p>{notification.message}</p>
                      </div>
                      <div>
                        <span className={styles.notificationTimeStamp}>
                          {notification.dateCreated
                            ? formatDistanceToNow(localDate) + " ago"
                            : "Invalid date"}
                        </span>
                      </div>
                    </AccordionPanel>
                  </AccordionItem>
                );
              })}
            </Accordion>
          ) : (
            <div className={styles.noUnreadNotifications}>
              <BellIcon
                boxSize={10}
                transition="color 0.3s ease"
                _hover={{ color: "#2557a7" }}
              />
              <span className={styles.noNewMessage}>
                You are all caught up!
              </span>
              <br />
            </div>
          )}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
