import { useQuery } from "react-query";
import axios from "axios";

const useGetByLocation = (searchTerm) => {
  return useQuery(
    ["locations", searchTerm],
    async () => {
      if (!searchTerm) {
        return [];
      }

      const { data } = await axios.get(
        `https://localhost:7013/api/Locations/GetBySearch?search=${searchTerm}`
      );
      return data;
    },
    {
      enabled: !!searchTerm,
    }
  );
};

export default useGetByLocation;
