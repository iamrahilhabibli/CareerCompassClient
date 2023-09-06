import React, { useState } from "react";
import { useQuery } from "react-query";
import jobPosts from "../../images/jobposts.png";
import axios from "axios";
import { fetchRecruiterDetails } from "../../services/fetchRecruiterDetails";
import useUser from "../../customhooks/useUser";
import { IoTrashOutline, IoPencilOutline } from "react-icons/io5";
import {
  Box,
  Flex,
  Heading,
  Spinner,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useToast,
} from "@chakra-ui/react";

export function PostedJobs() {
  const { userId, token, isAuthenticated } = useUser();
  const [vacanciesList, setVacanciesList] = useState([]);
  const toast = useToast();
  const fetchVacancies = async (id, token) => {
    const url = `https://localhost:7013/api/Vacancies/GetVacanciesById?id=${id}`;

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        setVacanciesList(response.data);
      }
    } catch (error) {
      console.error("Error fetching vacancies:", error);
    }
  };

  const { data: recruiterDetails } = useQuery(
    ["recruiterDetails", userId],
    () => fetchRecruiterDetails(userId, token),
    {
      enabled: Boolean(userId) && isAuthenticated,
    }
  );

  const {
    data: vacancies,
    isLoading,
    error: vacanciesError,
  } = useQuery(
    ["vacancies", recruiterDetails?.id],
    () => fetchVacancies(recruiterDetails?.id, token),
    {
      enabled: Boolean(recruiterDetails?.id) && isAuthenticated,
    }
  );
  if (vacanciesError) {
    console.error("Error fetching vacancies:", vacanciesError);
  }
  const handleDelete = async (vacancyId) => {
    console.log("Trying to delete vacancy with ID:", vacancyId);
    try {
      const response = await axios.delete(
        `https://localhost:7013/api/Vacancies/${vacancyId}`
      );
      if (response.status === 204) {
        // Remove the deleted vacancy from the list
        setVacanciesList((prevVacanciesList) =>
          prevVacanciesList.filter((vacancy) => vacancy.id !== vacancyId)
        );
        toast({
          title: "Success!",
          description: "Successfully deleted the vacancy.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.log("Error deleting vacancy:", error);
      toast({
        title: "An error occurred.",
        description: "Failed to delete the vacancy.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  if (isLoading) {
    return (
      <Spinner
        size="xl"
        thickness="4px"
        speed="0.5s"
        emptyColor="gray.200"
        color="blue.500"
      />
    );
  }
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
        bgImage={jobPosts}
        bgPosition="right"
        shadow="1px 1px 3px rgba(0,0,0,0.3)"
      >
        <Flex alignItems={"center"} ml={"50px"} width={"100%"} height={"100%"}>
          <Heading color={"#2D2D2D"} fontSize={"28px"} as="h5" size="md">
            Review your Job Posts
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
            <TableCaption>Job Posts</TableCaption>
            <Thead>
              <Tr>
                <Th>#</Th>
                <Th>Company Name</Th>
                <Th>Job Title</Th>
                <Th>Location</Th>
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
              ) : vacanciesList.length === 0 ? (
                <Tr>
                  <Td colSpan="6">No vacancies available</Td>
                </Tr>
              ) : (
                vacanciesList.map((vacancy, index) => (
                  <Tr key={index}>
                    <Td isNumeric>{index + 1}</Td>
                    <Td>{vacancy.companyName}</Td>
                    <Td>{vacancy.jobTitle}</Td>
                    <Td>{vacancy.jobLocation}</Td>

                    <Td>
                      <Flex direction="row" align="center">
                        <IoPencilOutline
                          size={24}
                          style={{ cursor: "pointer", marginRight: "15px" }}
                          // onClick={() => handleEdit(vacancy.id)}
                        />
                        <IoTrashOutline
                          size={24}
                          style={{ cursor: "pointer", color: "red" }}
                          onClick={() => handleDelete(vacancy.id)}
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
