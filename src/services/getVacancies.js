import { useQuery } from "react-query";
import axios from "axios";

const fetchVacancies = async (jobTitle, locationId) => {
  const url = `https://localhost:7013/api/Vacancies/GetFilteredSearch`;
  const params = {
    jobTitle: jobTitle || null,
    locationId: locationId || null,
  };

  const response = await axios.get(url, { params });
  return response.data;
};

export const useVacancies = (jobTitle, locationId) => {
  return useQuery(
    ["vacancies", jobTitle, locationId],
    () => fetchVacancies(jobTitle, locationId),
    {
      enabled: !!jobTitle || !!locationId,
    }
  );
};
