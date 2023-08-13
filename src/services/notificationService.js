import axios from "axios";

export const notificationService = async (userId, token) => {
  const response = await axios.get(
    `https://localhost:7013/api/Notifications/GetNotifications/${userId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};
