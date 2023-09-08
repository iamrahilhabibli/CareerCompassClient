import axios from "axios";
import { useQuery } from "react-query";

const fetchVacancies = async (jobTitle, locationId, sortOrder, jobType) => {
  const url = `https://localhost:7013/api/Vacancies/GetFilteredSearch`;
  const params = {
    jobTitle: jobTitle || null,
    locationId,
    sortOrder,
    jobType,
  };

  const response = await axios.get(url, { params });
  return response.data;
};

export const useVacancies = (jobTitle, locationId, sortOrder, jobType) => {
  return useQuery(
    ["vacancies", jobTitle, locationId, sortOrder, jobType],
    () => fetchVacancies(jobTitle, locationId, sortOrder, jobType),
    {
      enabled: !!jobTitle || !!locationId || !!sortOrder || !!jobType,
    }
  );
};
