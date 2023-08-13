import { useQuery } from "react-query";
import { notificationService } from "../services/notificationService";

export const useNotifications = (userId, token) => {
  return useQuery(
    ["notifications", userId, token],
    () => notificationService(userId, token),
    {
      onError: (error) => {
        // Log the error here
        console.error("Error fetching notifications:", error);
      },
    }
  );
};
