import axios from "axios";
import { useQuery } from "react-query";

const fetchVacancies = async (
  jobTitle,
  locationId,
  sortOrder,
  jobType,
  minSalary,
  maxSalary
) => {
  const url = `https://localhost:7013/api/Vacancies/GetFilteredSearch`;
  const params = {
    "job-title": jobTitle || null,
    "location-id": locationId,
    sortOrder,
    jobType,
    minSalary,
    maxSalary,
  };

  const response = await axios.get(url, { params });
  return response.data;
};

export const useVacancies = (
  jobTitle,
  locationId,
  sortOrder,
  jobType,
  minSalary,
  maxSalary
) => {
  return useQuery(
    [
      "vacancies",
      jobTitle,
      locationId,
      sortOrder,
      jobType,
      minSalary,
      maxSalary,
    ],
    () =>
      fetchVacancies(
        jobTitle,
        locationId,
        sortOrder,
        jobType,
        minSalary,
        maxSalary
      ),
    {
      enabled:
        !!jobTitle ||
        !!locationId ||
        !!sortOrder ||
        !!jobType ||
        !!minSalary ||
        !!maxSalary,
    }
  );
};
