import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Box, Heading, Image, Text, VStack } from "@chakra-ui/react";
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
    <div>
      {company ? (
        <Box display="flex" flexDirection="column" alignItems="center">
          <Image
            boxSize="200px"
            mt={"20px"}
            objectFit="cover"
            borderRadius="12px"
            boxShadow="0px 4px 10px rgba(0, 0, 0, 0.5)"
            src={company.logoUrl}
            alt={`${company.companyName} logo`}
          />
          <Heading mt={"20px"}>{company.name}</Heading>
          <VStack align="start" spacing={2} mt={4}>
            <Text fontSize="md">Description: {company.description}</Text>
            <Text fontSize="md">Industry: {company.industry}</Text>
            <Text fontSize="md">Date Founded: {company.dateFounded}</Text>
            <Text fontSize="md">Company Size: {company.companySize}</Text>
            <Text fontSize="md">Ceo: {company.ceoName}</Text>
            <Text fontSize="md">Address: {company.address}</Text>
            <Link href={company.webLink} isExternal fontSize="md">
              Website: {company.webLink}
            </Link>
          </VStack>
        </Box>
      ) : (
        "Loading..."
      )}
    </div>
  );
}
