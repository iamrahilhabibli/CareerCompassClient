import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Box,
  Button,
  Grid,
  GridItem,
  Heading,
  Image,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import useUser from "../customhooks/useUser";
import { fetchCompanyDetails } from "../services/fetchCompanyDetails";

export function ReviewCompanyDetails() {
  const { companyId } = useParams();
  const [company, setCompany] = useState(null);
  const { userId, token } = useUser();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedCompany = await fetchCompanyDetails(companyId, token);
        setCompany(fetchedCompany);
      } catch (error) {
        console.error("Failed to fetch company:", error);
      }
    };
    fetchData();
  }, [companyId, token]);
  console.log(company);
  return (
    <Box display="flex" width="100vw" height="100vh">
      <Box
        flex="1"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
      >
        {company ? (
          <>
            <Image
              boxSize="200px"
              mt={"20px"}
              objectFit="cover"
              borderRadius="12px"
              boxShadow="0px 4px 10px rgba(0, 0, 0, 0.5)"
              src={company.logoUrl}
              alt={`${company.companyName} logo`}
            />
            <Box
              display={"flex"}
              justifyContent={"center"}
              alignItems={"center"}
              gap={"20px"}
            >
              <Heading mt={"20px"}>{company.name}</Heading>
              <Button colorScheme="blue">Write a review</Button>
            </Box>
            <Box display="flex" justifyContent="center" alignItems="center">
              <Grid templateColumns="repeat(2, 1fr)" gap={5}>
                <GridItem>
                  <Text fontWeight="bold">Industry:</Text>
                  <Text>{company.industry}</Text>
                </GridItem>
                <GridItem>
                  <Text fontWeight="bold">Date Founded:</Text>
                  <Text>{company.dateFounded}</Text>
                </GridItem>
                <GridItem>
                  <Text fontWeight="bold">Company Size:</Text>
                  <Text>{company.companySize}</Text>
                </GridItem>
                <GridItem>
                  <Text fontWeight="bold">Ceo:</Text>
                  <Text>{company.ceoName}</Text>
                </GridItem>
                <GridItem>
                  <Text fontWeight="bold">Address:</Text>
                  <Text>{company.address}</Text>
                </GridItem>
                <GridItem>
                  <Text fontWeight="bold">Website:</Text>
                  <Link href={company.webLink} isExternal>
                    {company.webLink}
                  </Link>
                </GridItem>
                <GridItem>
                  <Text fontWeight="bold">Description:</Text>
                  <Box height="100px" overflowY="auto">
                    <Text>{company.description}</Text>
                  </Box>
                </GridItem>
              </Grid>
            </Box>
          </>
        ) : (
          <Spinner />
        )}
      </Box>
      <Box flex="1" bg="gray.100">
        <Heading>{company.name} Reviews</Heading>
      </Box>
    </Box>
  );
}
