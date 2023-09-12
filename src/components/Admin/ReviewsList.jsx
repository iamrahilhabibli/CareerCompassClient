import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Icon,
  Input,
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
  Textarea,
  Th,
  Thead,
  Tr,
  useToast,
} from "@chakra-ui/react";
import { FaStar, FaRegStar } from "react-icons/fa";
import { IconButton } from "@chakra-ui/button";
import { ViewIcon, CheckIcon, CloseIcon, StarIcon } from "@chakra-ui/icons";
import React, { useEffect, useState } from "react";
import reviewsImg from "../../images/reviewsImg.png";
import useUser from "../../customhooks/useUser";
import axios from "axios";
export default function ReviewsList() {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedReview, setSelectedReview] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const { userId, token } = useUser();
  const toast = useToast();
  const removeReviewFromList = (reviewId) => {
    const newReviews = reviews.filter((review) => review.reviewId !== reviewId);
    setReviews(newReviews);
  };
  useEffect(() => {
    const fetchPendingReviews = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const { data } = await axios.get(
          "https://localhost:7013/api/Dashboards/GetPendingReviews",
          config
        );
        setReviews(data);
      } catch (error) {
        console.error("Error fetching pending reviews:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPendingReviews();
  }, []);
  const handleApproveClick = async (reviewId) => {
    try {
      const response = await axios.patch(
        `https://localhost:7013/api/Dashboards/UpdateReviewStatus?reviewId=${reviewId}`,
        2,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        toast({
          title: "Success",
          description: "You have approved the review",
          status: "success",
          duration: 2000,
          position: "top-right",
          isClosable: true,
        });
        removeReviewFromList(reviewId);
      }
    } catch (error) {
      console.log(error);
      toast({
        title: "Something went wrong",
        description: "Please try again",
        status: "error",
        duration: 2000,
        position: "top-right",
        isClosable: true,
      });
    }
  };

  const handleDeclineClick = async (reviewId) => {
    try {
      const response = await axios.patch(
        `https://localhost:7013/api/Dashboards/UpdateReviewStatus?reviewId=${reviewId}`,
        1,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        toast({
          title: "Success",
          description: "You have declined the review",
          status: "success",
          duration: 2000,
          position: "top-right",
          isClosable: true,
        });
        removeReviewFromList(reviewId);
      }
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "Please try again",
        status: "error",
        duration: 2000,
        position: "top-right",
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
        bgImage={reviewsImg}
        bgPosition="right"
        shadow="1px 1px 3px rgba(0,0,0,0.3)"
      >
        <Flex alignItems={"center"} ml={"50px"} width={"100%"} height={"100%"}>
          <Heading color={"#2D2D2D"} fontSize={"28px"} as="h5" size="md">
            Manage reviews
          </Heading>
        </Flex>
      </Box>
      <Box my={4} />
      {/* <Box mb={4}>
        <Flex align="center" justify="space-between">
          <Input
            bgColor={"white"}
            placeholder="Search by location or company name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            padding={2}
            width={"300px"}
            borderRadius="md"
            fontSize="sm"
            boxShadow="sm"
          />
          <Button
            onClick={() => setSearchQuery(searchQuery)}
            colorScheme="blue"
            ml={4}
          >
            Search
          </Button>
        </Flex>
      </Box> */}

      <Box
        borderWidth={"1px"}
        rounded={"lg"}
        bg={"white"}
        shadow="1px 1px 3px rgba(0,0,0,0.3)"
      >
        <TableContainer>
          <Table variant="simple">
            <TableCaption></TableCaption>
            <Thead>
              <Tr>
                <Th>#</Th>
                <Th>User</Th>
                <Th>Title</Th>
                <Th>Preview</Th>
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
              ) : reviews.length === 0 ? (
                <Tr fontSize="sm">
                  <Td colSpan="6">No pending reviews available</Td>
                </Tr>
              ) : (
                reviews.map((review, index) => (
                  <Tr key={index} fontSize="sm">
                    <Td isNumeric>{index + 1}</Td>
                    <Td>{review.email}</Td>
                    <Td>{review.title}</Td>
                    <Td>
                      <IconButton
                        aria-label="Preview Review"
                        icon={<ViewIcon />}
                        size="xs"
                        onClick={() => {
                          setSelectedReview(review);
                          setIsPreviewOpen(true);
                        }}
                      />
                    </Td>
                    <Td>
                      <Flex direction="row" spacing={2} gap={"10px"}>
                        <IconButton
                          aria-label="Approve Review"
                          icon={<CheckIcon />}
                          size="xs"
                          colorScheme="green"
                          borderRadius="full"
                          onClick={() => handleApproveClick(review.reviewId)}
                        />
                        <IconButton
                          aria-label="Decline Review"
                          icon={<CloseIcon />}
                          size="xs"
                          colorScheme="red"
                          borderRadius="full"
                          onClick={() => handleDeclineClick(review.reviewId)}
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
      <Modal
        // initialFocusRef={initialRef}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Review Preview</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedReview && (
              <>
                <FormControl>
                  <FormLabel>Title</FormLabel>
                  <Input isReadOnly value={selectedReview.title} />
                </FormControl>
                <FormControl mt={4}>
                  <FormLabel>Description</FormLabel>
                  <Textarea isReadOnly value={selectedReview.description} />
                </FormControl>
                <FormControl mt={4}>
                  <FormLabel>Rating</FormLabel>
                  <div>
                    {[1, 2, 3, 4, 5].map((starValue) => (
                      <IconButton
                        key={starValue}
                        aria-label="Rate Job"
                        icon={
                          <Icon
                            as={
                              starValue <= selectedReview.rating
                                ? FaStar
                                : FaRegStar
                            }
                          />
                        }
                        color={
                          starValue <= selectedReview.rating
                            ? "yellow.400"
                            : "gray.300"
                        }
                        isDisabled
                      />
                    ))}
                  </div>
                </FormControl>
              </>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              variant="ghost"
              onClick={() => setIsPreviewOpen(false)}
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
