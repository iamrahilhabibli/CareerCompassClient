import { Box, Text } from "@chakra-ui/react";
import { useLocation } from "react-router-dom";
import { useVacancies } from "../../services/getVacancies";

export function SearchResultCards({ searchResults }) {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const jobTitle = queryParams.get("jobTitle");
  const locationId = queryParams.get("locationId");

  const { data: vacancies, isLoading } = useVacancies(jobTitle, locationId);
  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center">
        <Spinner size="xl" />
      </Box>
    );
  }
  return (
    <Box display="flex" flexWrap="wrap" justifyContent="space-around">
      {vacancies?.map((result) => (
        <Box
          key={result.companyId}
          maxW="sm"
          borderWidth="1px"
          borderRadius="lg"
          overflow="hidden"
          m={4}
        >
          <Box p="6">
            <Box
              mt="1"
              fontWeight="semibold"
              as="h4"
              lineHeight="tight"
              isTruncated
            >
              {result.jobTitle}
            </Box>
            <Text color="gray.500">Company ID: {result.companyId}</Text>
            <Text>Location ID: {result.locationId}</Text>
            <Text>Salary: ${result.salary}</Text>
            <Text>Job Types: {result.jobTypeIds.join(", ")}</Text>
            <Text>
              Shifts and Schedules: {result.shiftAndScheduleIds.join(", ")}
            </Text>
            <Text>Description: {result.description}</Text>
            <Text>
              Company Link:{" "}
              <a href={result.companyLink}>{result.companyLink}</a>
            </Text>
            <Text>Date Created: {result.dateCreated}</Text>
          </Box>
        </Box>
      ))}
    </Box>
  );
}
