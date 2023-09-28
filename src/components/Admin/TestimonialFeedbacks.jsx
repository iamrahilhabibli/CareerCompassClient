import React from "react";
import feedbackImg from "../../images/userFeedback.png";
import {
  Box,
  Button,
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
  Text,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import useUser from "../../customhooks/useUser";
import { Link, useNavigate } from "react-router-dom";
import { CheckIcon, DeleteIcon, NotAllowedIcon } from "@chakra-ui/icons";

export default function TestimonialFeedbacks() {
  const [feedbackData, setFeedbackData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;
  const maxPage = Math.ceil(totalItems / itemsPerPage);
  const navigate = useNavigate();
  const { token } = useUser();
  const toast = useToast();
  const toastSuccess = (message) => {
    toast({
      title: message,
      status: "success",
      duration: 1000,
      isClosable: true,
      position: "top-right",
    });
  };

  const toastError = (message) => {
    toast({
      title: message,
      status: "error",
      duration: 1000,
      isClosable: true,
      position: "top-right",
    });
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://localhost:7013/api/Dashboards/GetAllUserFeedbacks?page=${currentPage}&pageSize=${itemsPerPage}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data && response.data.items) {
          setFeedbackData(response.data.items);
          setTotalItems(response.data?.totalItems || 0);
        }
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentPage]);
  const handleNext = () => {
    setCurrentPage((prevPage) => {
      const newPage = Math.min(prevPage + 1, maxPage);
      navigate(`/payments?page=${newPage}`);
      return newPage;
    });
  };

  const handlePrevious = () => {
    setCurrentPage((prevPage) => {
      const newPage = Math.max(prevPage - 1, 1);
      navigate(`/payments?page=${newPage}`);
      return newPage;
    });
  };

  const handleDeleteFeedback = async (feedbackId) => {
    try {
      const response = await axios.delete(
        `https://localhost:7013/api/Dashboards/RemoveFeedback?feedbackId=${feedbackId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.status === 200) {
        setFeedbackData((prevFeedbacks) =>
          prevFeedbacks.filter((feedback) => feedback.feedbackId !== feedbackId)
        );
        toastSuccess("Deleted successfully");
      }
    } catch (error) {
      toastError("Something went wrong");
    }
  };
  const handleSetIsActive = async (feedbackId) => {
    try {
      const response = await axios.post(
        `https://localhost:7013/api/Dashboards/SetIsActive?feedbackId=${feedbackId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        toast({
          title: "Success",
          description: "Successfully toggled the active state",
          status: "success",
          duration: 3000,
          isClosable: true,
        });

        const updatedFeedbacks = feedbackData.map((feedback) =>
          feedback.feedbackId === feedbackId
            ? { ...feedback, isActive: !feedback.isActive }
            : feedback
        );
        setFeedbackData([...updatedFeedbacks]);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong while toggling",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

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
        bgImage={feedbackImg}
        bgPosition="right"
        shadow="1px 1px 3px rgba(0,0,0,0.3)"
      >
        <Flex alignItems={"center"} ml={"50px"} width={"100%"} height={"100%"}>
          <Heading color={"#2D2D2D"} fontSize={"28px"} as="h5" size="md">
            Review User Feedbacks
          </Heading>
        </Flex>
      </Box>
      <Box my={4} />

      <Box my={4} />
      <Box
        borderWidth={"1px"}
        rounded={"lg"}
        bg={"white"}
        shadow="1px 1px 3px rgba(0,0,0,0.3)"
      >
        <TableContainer>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>#</Th>
                <Th>First Name</Th>
                <Th>Last Name</Th>
                <Th>Feedback</Th>
                <Th>Position</Th>
                <Th>Image Url</Th>
                <Th>Action</Th>
              </Tr>
            </Thead>
            <Tbody>
              {isLoading ? (
                <Tr fontSize="sm">
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
              ) : feedbackData.length === 0 ? (
                <Tr fontSize="sm">
                  <Td colSpan="6">No feedback available</Td>
                </Tr>
              ) : (
                feedbackData.map((feedback, index) => (
                  <Tr key={index} fontSize="sm">
                    <Td isNumeric>{index + 1}</Td>
                    <Td>{feedback.firstName}</Td>
                    <Td>{feedback.lastName}</Td>
                    <Td>
                      <Tooltip
                        label={feedback.description}
                        placement="top"
                        hasArrow
                      >
                        <span>
                          {feedback.description.substring(0, 20)}
                          {feedback.description.length > 20 && "..."}
                        </span>
                      </Tooltip>
                    </Td>

                    <Td>{feedback.position}</Td>
                    <Td>
                      <Link to={feedback.imageUrl} isExternal>
                        {feedback.imageUrl
                          ? feedback.imageUrl.substring(0, 20) + "..."
                          : ""}
                      </Link>
                    </Td>
                    <Td>
                      <Flex
                        direction="row"
                        spacing={2}
                        gap={"8px"}
                        alignItems={"center"}
                      >
                        {feedback.isActive ? (
                          <Button
                            colorScheme="red"
                            variant="outline"
                            size="xs"
                            borderRadius="full"
                            onClick={() =>
                              handleSetIsActive(feedback.feedbackId)
                            }
                          >
                            <NotAllowedIcon />
                          </Button>
                        ) : (
                          <Button
                            colorScheme="green"
                            variant="outline"
                            size="xs"
                            borderRadius="full"
                            onClick={() =>
                              handleSetIsActive(feedback.feedbackId)
                            }
                          >
                            <CheckIcon />
                          </Button>
                        )}

                        <Button
                          colorScheme="red"
                          variant="outline"
                          size="xs"
                          borderRadius="full"
                          onClick={() =>
                            handleDeleteFeedback(feedback.feedbackId)
                          }
                        >
                          <DeleteIcon />
                        </Button>
                      </Flex>
                    </Td>
                  </Tr>
                ))
              )}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="blue.50"
        p={4}
        rounded="md"
      >
        <Button
          colorScheme="blue"
          onClick={handlePrevious}
          isDisabled={currentPage === 1}
        >
          Previous
        </Button>
        <Text fontSize="xl" color="blue.800">
          Page {currentPage} of {maxPage}
        </Text>
        <Button
          colorScheme="blue"
          onClick={handleNext}
          isDisabled={currentPage >= maxPage}
        >
          Next
        </Button>
      </Box>
    </Box>
  );
}
