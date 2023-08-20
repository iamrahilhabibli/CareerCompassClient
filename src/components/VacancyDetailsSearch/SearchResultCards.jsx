import { Badge, Box, Flex, Spinner, Text } from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";
import { useVacancies } from "../../services/getVacancies";
import moment from "moment";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
export function SearchResultCards({ searchResults }) {
  const [selectedVacancy, setSelectedVacancy] = useState(null);
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const jobTitle = decodeURIComponent(searchParams.get("jobTitle"));
  const locationId = searchParams.get("locationId");
  console.log(jobTitle);
  console.log(locationId);
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

  return (
    <Flex flexDirection={"column"} maxWidth={"40%"}>
      <Box display="flex" flexWrap="wrap" justifyContent="space-around">
        {vacancies?.map((result) => (
          <Box
            key={result.id}
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            m={4}
            onClick={() => setSelectedVacancy(result)}
            cursor="pointer"
          >
            <Box p="6">
              <Text
                fontSize="18px"
                fontWeight="600"
                mt="1"
                lineHeight="tight"
                isTruncated
              >
                {result.jobTitle}
              </Text>
              <Text color="gray.500">{result.companyName}</Text>
              <Text>{result.locationName}</Text>
              <Badge colorScheme="blue" p={1}>
                ${result.salary}
              </Badge>
              <Badge colorScheme="blue" p={1}>
                {result.jobTypeIds.join(", ")}
              </Badge>
              <div
                dangerouslySetInnerHTML={{
                  __html: `${result.description}`,
                }}
              />
              <Text>
                Company Link:{" "}
                <a href={result.companyLink}>{result.companyLink}</a>
              </Text>
              <Flex justifyContent="space-between">
                <Text fontSize="sm" color="gray.500">
                  {moment(result.dateCreated).fromNow()}
                </Text>
              </Flex>
            </Box>
          </Box>
        ))}
      </Box>
    </Flex>
  );
}
