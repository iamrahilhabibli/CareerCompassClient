import axios from "axios";
export const fetchRecruiterDetails = (userId, token) => {
  const url = `https://localhost:7013/api/Recruiters/GetRecruiter/${userId}`;
  return axios
    .get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => response.data);
};
