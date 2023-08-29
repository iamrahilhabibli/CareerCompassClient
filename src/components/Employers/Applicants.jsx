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
import React from "react";
import { IoCheckmarkSharp, IoCloseSharp } from "react-icons/io5";
import applicantPicture from "../../images/applicants.png";
import useUser from "../../customhooks/useUser";
import axios from "axios";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";

export function Applicants() {
  const { userId } = useUser();
  const {
    data: applicants,
    isLoading,
    isError,
  } = useQuery(
    ["applicants", userId],
    () =>
      axios
        .get(
          `https://localhost:7013/api/JobApplications/GetApplicants?appUserId=${userId}`
        )
        .then((res) => res.data),
    {
      enabled: Boolean(userId),
    }
  );
  console.log(applicants);

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
                        <button>Download Resume</button>
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
