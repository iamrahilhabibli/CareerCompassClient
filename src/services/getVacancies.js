import axios from "axios";
import { useQuery } from "react-query";

const fetchVacancies = async (jobTitle, locationId, sortOrder) => {
  const url = `https://localhost:7013/api/Vacancies/GetFilteredSearch`;
  const params = {
    jobTitle: jobTitle || null,
    locationId,
    sortOrder,
  };

  const response = await axios.get(url, { params });
  return response.data;
};

export const useVacancies = (jobTitle, locationId, sortOrder) => {
  return useQuery(
    ["vacancies", jobTitle, locationId, sortOrder],
    () => fetchVacancies(jobTitle, locationId, sortOrder),
    {
      enabled: !!jobTitle || !!locationId || !!sortOrder,
    }
  );
};
