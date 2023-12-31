import { useQuery } from "react-query";
import { notificationService } from "../services/notificationService";

export const useNotifications = (userId, token) => {
  return useQuery(
    ["notifications", userId, token],
    () => notificationService(userId, token),
    {
      onError: (error) => {
        console.error("Error fetching notifications:", error);
      },
      enabled: !!userId && !!token,
    }
  );
};
