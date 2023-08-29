import {
  Box,
  Button,
  Flex,
  Heading,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import { IoCheckmarkSharp, IoCloseSharp } from "react-icons/io5";
import { FaDownload } from "react-icons/fa";
import applicantPicture from "../../images/applicants.png";
import axios from "axios";
import { useQuery } from "react-query";
import useUser from "../../customhooks/useUser";
export function Applicants() {
  const { userId } = useUser();
  console.log(userId);
  const {
    data: applicants,
    isLoading,
    isError,
  } = useQuery(
    ["applicants", userId],
    async () => {
      try {
        const response = await axios.get(
          `https://localhost:7013/api/JobApplications/GetApplicants?appUserId=${userId}`
        );
        return response.data;
      } catch (error) {
        throw new Error("An error occurred while fetching applicants.");
      }
    },
    {
      enabled: Boolean(userId), // Only fetch data if userId exists
    }
  );

  return (
    <Box
      rounded={"lg"}
      maxWidth={800}
      m="10px auto"
      borderRadius={"12px"}
      p={4}
      bg={"transparent"}
    >
      <Box
        borderWidth={"1px"}
        rounded={"lg"}
        height={"200px"}
        bg={"white"}
        bgRepeat="no-repeat"
        bgSize="auto 100%"
        bgPosition="right"
        bgImage={applicantPicture}
        shadow="1px 1px 3px rgba(0,0,0,0.3)"
      >
        <Flex alignItems={"center"} ml={"50px"} width={"100%"} height={"100%"}>
          <Heading color={"#2D2D2D"} fontSize={"28px"} as="h5" size="md">
            Review your Applicants
          </Heading>
        </Flex>
      </Box>
      <Box my={4} />

      <Box
        borderWidth={"1px"}
        rounded={"lg"}
        bg={"white"}
        shadow="1px 1px 3px rgba(0,0,0,0.3)"
      >
        <TableContainer>
          <Table variant="simple">
            <TableCaption>Job Applicants</TableCaption>
            <Thead>
              <Tr>
                <Th>#</Th>
                <Th>FirstName</Th>
                <Th>LastName</Th>
                <Th>Applied Position</Th>
                <Th>Resume</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {isLoading ? (
                <Tr>
                  <Td colSpan="6">Loading...</Td>
                </Tr>
              ) : isError ? (
                <Tr>
                  <Td colSpan="6">An error occurred</Td>
                </Tr>
              ) : (
                applicants.map((applicant, index) => (
                  <Tr key={index}>
                    <Td isNumeric>{index + 1}</Td>
                    <Td>{applicant.firstName}</Td>
                    <Td>{applicant.lastName}</Td>
                    <Td>{applicant.jobTitle}</Td>
                    <Td>
                      <a href={applicant.Resume} download>
                        <FaDownload
                          size={"24px"}
                          style={{ cursor: "pointer" }}
                        />
                      </a>
                    </Td>
                    <Td>
                      <Flex>
                        <IoCheckmarkSharp
                          color="green"
                          size={"24px"}
                          style={{ cursor: "pointer", marginRight: "10px" }}
                        />
                        <IoCloseSharp
                          size={"24px"}
                          color="red"
                          style={{ cursor: "pointer" }}
                        />
                      </Flex>
                    </Td>
                  </Tr>
                ))
              )}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}