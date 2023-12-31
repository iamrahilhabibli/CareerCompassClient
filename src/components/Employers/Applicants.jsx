import {
  Box,
  Flex,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
  useDisclosure,
  Button,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import styles from "./Applicant.module.css";
import { IoCheckmarkSharp, IoCloseSharp } from "react-icons/io5";
import { FaDownload } from "react-icons/fa";
import applicantPicture from "../../images/applicants.png";
import axios from "axios";
import { useQuery } from "react-query";
import useUser from "../../customhooks/useUser";
import { AcceptApplicantAlert } from "../AlertDialog/AcceptApplicantAlert";
import { RejectApplicantAlert } from "../AlertDialog/RejectApplicantAlert";
import { useDispatch, useSelector } from "react-redux";
import { DownloadIcon } from "@chakra-ui/icons";
export function Applicants() {
  const { userId } = useUser();
  const [isUserIdFetched, setIsUserIdFetched] = useState(false);
  const [selectedApplicationId, setSelectedApplicationId] = useState(null);
  const dispatch = useDispatch();
  const {
    applicants: reduxApplicants,
    status,
    error,
  } = useSelector((state) => state.applicant);

  const mapEnumToString = (status) => {
    switch (status) {
      case 0:
        return "Rejected";
      case 1:
        return "Pending";
      case 2:
        return "Accepted";
      default:
        return "Unknown";
    }
  };

  const {
    isOpen: isOpenCheck,
    onOpen: onOpenCheck,
    onClose: onCloseCheck,
  } = useDisclosure();
  const {
    isOpen: isOpenClose,
    onOpen: onOpenClose,
    onClose: onCloseClose,
  } = useDisclosure();

  useEffect(() => {
    if (userId) {
      setIsUserIdFetched(true);
    }
  }, [userId]);
  const {
    data: applicants,
    isLoading,
    isError,
    refetch,
  } = useQuery(
    ["applicants", userId],
    async () => {
      const response = await axios.get(
        `https://localhost:7013/api/JobApplications/GetApplicants?appUserId=${userId}`
      );
      return response.data;
    },
    {
      enabled: isUserIdFetched,
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
                  <Td colSpan="6">
                    <Flex
                      justify="center"
                      align="center"
                      height="100px"
                      width="100%"
                    >
                      <Spinner />
                    </Flex>
                  </Td>
                </Tr>
              ) : isError ? (
                <Tr>
                  <Td colSpan="6">An error occurred</Td>
                </Tr>
              ) : (
                applicants?.map((applicant, index) => (
                  <Tr key={index}>
                    <Td isNumeric>{index + 1}</Td>
                    <Td>{applicant.firstName}</Td>
                    <Td>{applicant.lastName}</Td>
                    <Td>{applicant.jobTitle}</Td>
                    <Td>
                      <a href={applicant.resumeLink} download>
                        <DownloadIcon
                          size={"24px"}
                          style={{ cursor: "pointer" }}
                        />
                      </a>
                    </Td>
                    <Td>
                      <Flex>
                        {applicant.status === 1 ? (
                          <>
                            <IoCheckmarkSharp
                              color="green"
                              size={"24px"}
                              style={{ cursor: "pointer", marginRight: "10px" }}
                              onClick={() => {
                                setSelectedApplicationId(
                                  applicant.applicationid
                                );
                                onOpenCheck();
                              }}
                            />
                            <AcceptApplicantAlert
                              isOpen={isOpenCheck}
                              onClose={onCloseCheck}
                              applicationId={selectedApplicationId}
                            />
                            <IoCloseSharp
                              size={"24px"}
                              color="red"
                              style={{ cursor: "pointer" }}
                              onClick={() => {
                                setSelectedApplicationId(
                                  applicant.applicationid
                                );
                                onOpenClose();
                              }}
                            />
                            <RejectApplicantAlert
                              isOpen={isOpenClose}
                              onClose={onCloseClose}
                              applicationId={selectedApplicationId}
                            />
                          </>
                        ) : (
                          <span>{mapEnumToString(applicant.status)}</span>
                        )}
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
