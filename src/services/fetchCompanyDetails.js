import axios from "axios";

export const fetchCompanyDetails = (companyId, token) => {
  const url = `https://localhost:7013/api/Companies/GetDetails?companyId=${companyId}`;

  return axios
    .get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => response.data)
    .catch((error) => {
      console.error("There was an error fetching the company details:", error);
      throw error;
    });
};
