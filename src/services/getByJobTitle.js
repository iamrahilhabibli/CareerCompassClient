import { useQuery } from "react-query";
import axios from "axios";

const useGetByJobTitle = (searchTerm) => {
  return useQuery(
    ["jobTitles", searchTerm],
    async () => {
      if (!searchTerm) {
        return [];
      }
      const { data } = await axios.get(
        `https://localhost:7013/api/Vacancies/GetBySearch?jobTitle=${searchTerm}`
      );
      return data;
    },
    {
      enabled: !!searchTerm,
    }
  );
};

export default useGetByJobTitle;
