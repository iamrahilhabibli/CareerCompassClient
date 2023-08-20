import { Badge, Box, Flex, Spinner, Text } from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";
import { Link as ChakraLink } from "@chakra-ui/react";
import { useVacancies } from "../../services/getVacancies";
import { ExternalLinkIcon } from "@chakra-ui/icons";
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
            className={styles.Container}
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
              <Text fontSize={"16px"} color="gray.500" fontWeight={300}>
                {result.companyName}
              </Text>
              <Text fontSize={"16px"} color="gray.500" fontWeight={300} mb={3}>
                {result.locationName}
              </Text>
              <Badge fontWeight={600} mr={1} mb={3} colorScheme="gray" p={2}>
                ${result.salary}
              </Badge>
              <br />
              {result.jobTypeIds.map((jobType, index) => (
                <Badge
                  fontWeight={600}
                  key={index}
                  mr={1}
                  mb={3}
                  colorScheme="gray"
                  p={2}
                >
                  {jobType}
                </Badge>
              ))}

              <div
                className={styles.Description}
                dangerouslySetInnerHTML={{
                  __html: `${result.description.substring(0, 50)}`,
                }}
              />
              <ChakraLink
                color={"blue.400"}
                href={result.companyLink}
                isExternal
              >
                <ExternalLinkIcon mx="2px" />
              </ChakraLink>
              <Flex justifyContent="space-between">
                <Text fontSize="xs" color="gray.500">
                  {moment(result.dateCreated).local().fromNow()}
                </Text>
              </Flex>
            </Box>
          </Box>
        ))}
      </Box>
    </Flex>
  );
}
