import axios from "axios";

export const registerCompany = async (data, token, userId) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.post(
      `https://localhost:7013/api/Companies/Create?userId=${userId}`,
      data,
      config
    );

    return response.data || null;
  } catch (error) {
    if (error.response) {
      console.log(error.response);
      throw new Error(
        error.response.data.message ||
          "Unexpected error occured please try again later"
      );
    } else if (error.request) {
      throw new Error("No response received from server.");
    } else {
      throw new Error("Error setting up request.");
    }
  }
};
