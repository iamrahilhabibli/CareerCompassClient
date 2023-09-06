import { useQuery } from "react-query";
import axios from "axios";

const fetchVacancies = async (jobTitle, locationId, page, pageSize) => {
  const url = `https://localhost:7013/api/Vacancies/GetFilteredSearch`;
  const params = { jobTitle: jobTitle || null, locationId, page, pageSize };

  const response = await axios.get(url, { params });
  return response.data;
};

export const useVacancies = (jobTitle, locationId, page = 1, pageSize = 6) => {
  return useQuery(
    ["vacancies", jobTitle, locationId, page],
    () => fetchVacancies(jobTitle, locationId, page, pageSize),
    {
      enabled: !!jobTitle || !!locationId,
    }
  );
};
