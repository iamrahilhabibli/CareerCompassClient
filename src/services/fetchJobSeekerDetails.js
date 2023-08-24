import axios from "axios";

export const fetchJobSeekerDetails = (userId, token) => {
  const url = `https://localhost:7013/api/JobSeekers/GetByUserId?userId=${userId}`;
  return axios
    .get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      console.log("Full response:", response);
      return response.data;
    })
    .catch((error) => {
      console.error(
        "An error occurred while fetching job seeker details:",
        error
      );
      return null;
    });
};
