import { Box, Spinner, Text } from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";
import { useVacancies } from "../../services/getVacancies";
import moment from "moment";
export function SearchResultCards({ searchResults }) {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const jobTitle = queryParams.get("jobTitle");
  const locationId = queryParams.get("locationId");
  const navigate = useNavigate();
  const {
    data: vacancies,
    isLoading,
    isError,
  } = useVacancies(jobTitle, locationId);
  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center">
        <Spinner
          size="xl"
          thickness="4px"
          speed="0.5s"
          emptyColor="gray.200"
          color="blue.500"
        />
      </Box>
    );
  }
  if (isError) {
    navigate("/somethingwentwrong");
  }
  console.log(vacancies);
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
            <Text color="gray.500">Company ID: {result.companyName}</Text>
            <Text>Location ID: {result.locationName}</Text>
            <Text>Salary: ${result.salary}</Text>
            <Text>Job Types: {result.jobTypeIds.join(", ")}</Text>
            <Text>
              Shifts and Schedules: {result.shiftAndScheduleIds.join(", ")}
            </Text>
            <div
              dangerouslySetInnerHTML={{
                __html: `Description: ${result.description}`,
              }}
            />

            <Text>
              Company Link:{" "}
              <a href={result.companyLink}>{result.companyLink}</a>
            </Text>
            <Text>Date Created: {moment(result.dateCreated).fromNow()}</Text>
          </Box>
        </Box>
      ))}
    </Box>
  );
}
