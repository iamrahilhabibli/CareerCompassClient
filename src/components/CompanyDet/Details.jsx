import React, { useState, useEffect } from "react";
import styles from "./Details.module.css";
import useUser from "../../customhooks/useUser";
import { fetchRecruiterDetails } from "../../services/fetchRecruiterDetails";
import { fetchCompanyDetails } from "../../services/fetchCompanyDetails";
import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Flex,
  Heading,
  Spinner,
  Text,
  VStack,
  Image,
} from "@chakra-ui/react";

export function Details() {
  const { isAuthenticated, loading, userId } = useUser();
  const token = localStorage.getItem("token");

  const [recruiter, setRecruiter] = useState(null);
  const [company, setCompany] = useState(null);

  useEffect(() => {
    async function getRecruiterDetails() {
      if (isAuthenticated && !loading && userId && token) {
        try {
          const recruiterData = await fetchRecruiterDetails(userId, token);
          setRecruiter(recruiterData);

          if (recruiterData.companyId) {
            const companyData = await fetchCompanyDetails(
              recruiterData.companyId,
              token
            );
            setCompany(companyData);
          }
        } catch (error) {
          console.error("Error fetching details:", error);
        }
      }
    }
    getRecruiterDetails();
  }, [isAuthenticated, loading, userId, token]);

  if (loading) {
    return (
      <Flex justifyContent="center" alignItems="center" height="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  return (
    <Box width="70%" mx="auto" mt={10} p={5}>
      <Card borderRadius="lg" shadow="md" overflow="hidden">
        <Flex direction="column" alignItems="center" p={5}>
          <Image
            boxSize="150px"
            src="path_to_logo.jpg"
            alt="Company Logo"
            mb={5}
          />
          <CardHeader>
            <Heading size="md">
              {company ? company.name : <Spinner size="xs" />}
            </Heading>
          </CardHeader>
          <CardBody>
            <VStack spacing={3} align="start" w="100%">
              <Text>
                <strong>CEO:</strong>{" "}
                {company ? company.ceoName : <Spinner size="xs" />}
              </Text>
              <Text>
                <strong>Founded:</strong>{" "}
                {company ? company.dateFounded : <Spinner size="xs" />}
              </Text>
              <Text>
                <strong>Industry:</strong>{" "}
                {company ? company.industry : <Spinner size="xs" />}
              </Text>
              <Text>
                <strong>Website:</strong>{" "}
                <a
                  href={company ? company.webLink : "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {company ? company.webLink : <Spinner size="xs" />}
                </a>
              </Text>
            </VStack>
          </CardBody>
          <CardFooter>
            <Button colorScheme="blue" size="md" mt={5}>
              View More Details
            </Button>
          </CardFooter>
        </Flex>
      </Card>
    </Box>
  );
}
