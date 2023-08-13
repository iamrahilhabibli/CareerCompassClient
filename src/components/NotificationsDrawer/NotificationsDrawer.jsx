import {
  DrawerBody,
  DrawerHeader,
  DrawerContent,
  DrawerOverlay,
  Drawer,
} from "@chakra-ui/react";
import React from "react";
import { formatDistanceToNow } from "date-fns";
import styles from "../../Styles/NotificationDrawer/NotificationDrawer.module.css";
export function NotificationsDrawer({ isOpen, onClose, notifications }) {
  const placement = "right";
  console.log(notifications);
  return (
    <Drawer placement={placement} onClose={onClose} isOpen={isOpen}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerHeader borderBottomWidth="1px" textAlign={"center"}>
          Notifications
        </DrawerHeader>
        <DrawerBody>
          <div className={styles.notificationContainer}>
            {notifications?.map((notification) => (
              <div key={notification.id} className={styles.notification}>
                <div>
                  <h5>{notification.title}</h5>
                </div>
                <div>
                  <p>{notification.message}</p>
                </div>
                <div>
                  <span>
                    {notification.dateCreated
                      ? formatDistanceToNow(
                          new Date(notification.dateCreated)
                        ) + " ago"
                      : "Invalid date"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
