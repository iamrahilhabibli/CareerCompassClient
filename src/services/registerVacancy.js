import axios from "axios";

export const postVacancy = async (vacancyData, token, userId, companyId) => {
  try {
    const url = `https://localhost:7013/api/Vacancies?userId=${userId}&companyId=${companyId}`;

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    console.log("VacancyData", vacancyData);
    const jsonData = JSON.stringify(vacancyData);

    const response = await axios.post(url, jsonData, config);

    return response.data || null;
  } catch (error) {
    console.log("Error Details:", error); // Log the entire error object
    if (error.response) {
      console.log("Status Code:", error.response.status);
      console.error("Error response:", error.response);
      // Log the server's response data
      console.error("Server response data:", error.response.data);
      throw new Error(
        error.response.data.message || "Network response was not ok"
      );
    } else if (error.request) {
      throw new Error("No response received from server.");
    } else {
      throw new Error("Error setting up request.");
    }
  }
};
