import { Badge, Box, Flex, Spinner, Text } from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";
import { useVacancies } from "../../services/getVacancies";
import moment from "moment";
import { useState } from "react";
import styles from "./SearchRes.module.css";
import { useSearchParams } from "react-router-dom";
export function SearchResultCards({ searchResults }) {
  const [selectedVacancy, setSelectedVacancy] = useState(null);
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const jobTitle = decodeURIComponent(searchParams.get("jobTitle"));
  const locationId = searchParams.get("locationId");

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
    <Flex flexDirection={"column"} maxWidth={"60%"}>
      <Box display="flex" flexWrap="wrap" justifyContent="space-around">
        {vacancies?.map((result) => (
          <Box
            className={styles.container}
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
                _hover={{ textDecoration: "underline" }}
              >
                {result.jobTitle}
              </Text>
              <Text mb={3} color="gray.500">
                {result.companyName}
              </Text>
              <Text mb={3}>{result.locationName}</Text>
              <Badge mb={3} colorScheme="blue" p={1}>
                ${result.salary}
              </Badge>
              <br />
              <Badge mb={3} colorScheme="blue" p={1}>
                {result.jobTypeIds.join(", ")}
              </Badge>
              <div
                dangerouslySetInnerHTML={{
                  __html: `${result.description}`,
                }}
              />
              <Text>
                {" "}
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
