import React, { useState, useRef } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  IconButton,
  Icon,
  Button,
  useToast,
  Box,
  Grid,
  GridItem,
  Spinner,
  Divider,
  Heading,
  Text,
  Image,
  Link,
  Accordion,
  AccordionItem,
  AccordionButton,
  Avatar,
  AccordionPanel,
  AccordionIcon,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  Flex,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { FaStar, FaRegStar } from "react-icons/fa";
import { useFormik } from "formik";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "react-query";
import axios from "axios";
import useUser from "../customhooks/useUser";
import { fetchCompanyDetails } from "../services/fetchCompanyDetails";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { StarIcon } from "@chakra-ui/icons";
export function ReviewCompanyDetails() {
  const { companyId } = useParams();
  const [company, setCompany] = useState(null);
  const { userId, token } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const queryClient = useQueryClient();
  const initialRef = useRef();
  const toast = useToast();
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [counter, setCounter] = useState(5);
  const [pageIndex, setPageIndex] = useState(1);
  const navigate = useNavigate();
  const {
    isOpen: isModalOpen,
    onOpen: onModalOpen,
    onClose: onModalClose,
  } = useDisclosure();

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

  const mutation = useMutation(
    (newReview) => {
      return fetch("https://localhost:7013/api/Reviews/PostReview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newReview),
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("reviews");
        toast({
          title: "Submission Successful",
          description:
            "Thank you for submitting your review. It is currently under review by our moderation team and will be published upon approval.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      },

      onError: () => {
        toast({
          title: "Error",
          description: "Something went wrong while submitting your review.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      },
    }
  );

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
    },
    onSubmit: async (values) => {
      const payload = {
        appUserId: userId,
        title: values.title,
        description: values.description,
        rating,
        companyId,
      };
      mutation.mutate(payload);
      onClose();
    },
  });

  const pageSize = 10;

  const { data, isLoading, isError, fetchNextPage, isFetchingNextPage } =
    useInfiniteQuery(
      ["reviews", companyId],
      async ({ pageParam = 1 }) => {
        const res = await axios.get(
          `https://localhost:7013/api/Reviews/GetAllByCompanyId?companyId=${companyId}&pageIndex=${pageParam}&pageSize=${pageSize}`
        );
        const data = res.data;
        if (data.averageRating != null) {
          data.averageRating = parseFloat(data.averageRating.toFixed(1));
        }
        return data;
      },
      {
        getNextPageParam: (lastPage, allPages) => {
          const fetchedReviews = allPages.flatMap(
            (page) => page.reviews
          ).length;
          return fetchedReviews < lastPage.totalReviews
            ? allPages.length + 1
            : undefined;
        },
      }
    );

  const allReviews = data ? data.pages.flatMap((page) => page.reviews) : [];
  const averageRating = data ? data.pages[0]?.averageRating : 0;

  const onClose = () => setIsOpen(false);
  useEffect(() => {
    if (!token) {
      const timerId = setInterval(() => {
        setCounter((prevCounter) => prevCounter - 1);
      }, 1000);

      setTimeout(() => {
        clearInterval(timerId);
        navigate("/signin");
      }, 5000);

      return () => clearInterval(timerId);
    }
  }, [token, navigate]);

  if (!token) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        width="100%"
        height="100vh"
        bg="gray.200"
      >
        <Text fontSize="xl" mb={4}>
          Please sign in to continue.
        </Text>
        <Text fontSize="md" mb={2}>
          Redirecting you in {counter} seconds...
        </Text>
        <Spinner />
      </Box>
    );
  }
  const companySizeEnum = [
    "1-50",
    "51-100",
    "101-250",
    "251-500",
    "501-1000",
    "1001-2500",
    "2501-5000",
    "5001-10000",
    "10000+",
  ];
  return (
    <Box
      display="flex"
      flexWrap={{ base: "wrap", md: "nowrap" }}
      width="100%"
      height="100%"
    >
      <Box
        flex="1"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
      >
        {company ? (
          <>
            <Box
              display="flex"
              flexDirection={{ base: "column", md: "row" }}
              alignItems="center"
              justifyContent="center"
              gap="20px"
              mt="25px"
            >
              <Image
                boxSize={{ base: "150px", md: "200px" }}
                objectFit="cover"
                borderRadius="12px"
                boxShadow="0px 4px 10px rgba(0, 0, 0, 0.5)"
                src={company.logoUrl}
                alt={`${company.companyName} logo`}
                mr={"150px"}
              />
              <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                gap="20px"
              >
                <Heading mt={{ base: "10px", md: "20px" }} color="#2557A7">
                  {company.name}
                </Heading>
                <Box display="flex" flexDirection="column" alignItems="center">
                  <Text color="#2557A7" fontSize="60px" fontWeight="bold">
                    {averageRating}
                  </Text>
                  <Box display="flex">
                    {[...Array(5)].map((_, i) => (
                      <Box key={i} position="relative">
                        <StarIcon boxSize={"24px"} color="gray.300" />
                        {i < Math.floor(averageRating) && (
                          <Box position="absolute" top={0} left={0}>
                            <StarIcon boxSize="24px" color="#2557A7" />
                          </Box>
                        )}
                        {i === Math.floor(averageRating) && (
                          <Box
                            position="absolute"
                            top={0}
                            left={0}
                            overflow="hidden"
                            width={`${(averageRating % 1) * 100}%`}
                          >
                            <StarIcon boxSize="24px" color="#2557A7" />
                          </Box>
                        )}
                      </Box>
                    ))}
                  </Box>
                </Box>
                <Button colorScheme="blue" onClick={() => setIsOpen(true)}>
                  Write a review
                </Button>
              </Box>
            </Box>

            <Box
              display="flex"
              justifyContent="flex-end"
              alignItems="flex-end"
              alignContent="flex-end"
              mt="50px"
            >
              <Box
                maxWidth="90%"
                width="100%"
                display="flex"
                justifyContent="center"
                alignItems="center"
                textAlign={"center"}
              >
                <Grid templateColumns="repeat(2, 1fr)" gap={8}>
                  {" "}
                  <GridItem>
                    <Text
                      fontWeight="extrabold"
                      fontSize="2xl"
                      color="blue.700"
                    >
                      Industry:
                    </Text>
                    <Text mt={3} fontSize="lg">
                      {company.industry}
                    </Text>
                  </GridItem>
                  <GridItem>
                    <Text
                      fontWeight="extrabold"
                      fontSize="2xl"
                      color="blue.700"
                    >
                      Date Founded:
                    </Text>
                    <Text mt={3} fontSize="lg">
                      {company.dateFounded}
                    </Text>
                  </GridItem>
                  <GridItem>
                    <Text
                      fontWeight="extrabold"
                      fontSize="2xl"
                      color="blue.700"
                    >
                      Company Size:
                    </Text>
                    <Text mt={3} fontSize="lg">
                      {companySizeEnum[company.companySize]}
                    </Text>
                  </GridItem>
                  <GridItem>
                    <Text
                      fontWeight="extrabold"
                      fontSize="2xl"
                      color="blue.700"
                    >
                      CEO:
                    </Text>
                    <Text mt={3} fontSize="lg">
                      {company.ceoName}
                    </Text>
                  </GridItem>
                  <GridItem>
                    <Text
                      fontWeight="extrabold"
                      fontSize="2xl"
                      color="blue.700"
                    >
                      Address:
                    </Text>
                    <Text mt={3} fontSize="lg">
                      {company.address}
                    </Text>
                  </GridItem>
                  <GridItem>
                    <Text
                      fontWeight="extrabold"
                      fontSize="2xl"
                      color="blue.700"
                    >
                      Website:
                    </Text>
                    <Link
                      mt={3}
                      fontSize="lg"
                      href={company.webLink}
                      isExternal
                    >
                      {company.webLink}
                    </Link>
                  </GridItem>
                  <GridItem colSpan={2}>
                    <Text
                      fontWeight="extrabold"
                      fontSize="2xl"
                      color="blue.700"
                    >
                      About:
                    </Text>
                    <Box mt={3} height="100px" overflowY="auto">
                      <Text fontSize="lg">{company.description}</Text>
                    </Box>
                  </GridItem>
                </Grid>
              </Box>
            </Box>
          </>
        ) : (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100vh"
            width="100vw"
          >
            <Spinner
              size="xl"
              thickness="4px"
              speed="0.5s"
              emptyColor="gray.200"
              color="blue.500"
            />
          </Box>
        )}
      </Box>
      <Button color={"#2557A7"} onClick={onModalOpen}>
        See Reviews
      </Button>
      <Modal isOpen={isModalOpen} onClose={onModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader color="#2557A7">Reviews</ModalHeader>
          <ModalBody>
            <VStack spacing={4} overflowY="auto" maxHeight="80vh">
              {isLoading ? (
                <Spinner />
              ) : isError ? (
                <Text>Something went wrong...</Text>
              ) : (
                allReviews.map((review, index) => (
                  <Box
                    key={index}
                    p={4}
                    w="100%"
                    borderWidth={1}
                    borderRadius="md"
                    boxShadow="sm"
                  >
                    <Flex alignItems="center">
                      <Avatar name={`${review.firstName} ${review.lastName}`} />
                      <Text ml={4} fontWeight="bold">
                        {review.title}
                      </Text>
                    </Flex>
                    <Text mt={2}>
                      {[...Array(5)].map((_, i) => (
                        <StarIcon
                          key={i}
                          color={i < review.rating ? "#2557A7" : "gray.300"}
                        />
                      ))}
                    </Text>
                    <Divider my={2} />
                    <Text>{review.description}</Text>
                  </Box>
                ))
              )}
            </VStack>
            <Button
              isLoading={isFetchingNextPage}
              onClick={() => {
                console.log("Fetching next page...");
                fetchNextPage();
              }}
              mt={4}
            >
              Load More
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal initialFocusRef={initialRef} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent as="form" onSubmit={formik.handleSubmit}>
          <ModalHeader>Write a Review</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Title</FormLabel>
              <Input
                ref={initialRef}
                name="title"
                placeholder="Awesome place to work!"
                onChange={formik.handleChange}
                value={formik.values.title}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Description</FormLabel>
              <Textarea
                name="description"
                placeholder="Your experience and review"
                onChange={formik.handleChange}
                value={formik.values.description}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Rating</FormLabel>
              <div>
                {[1, 2, 3, 4, 5].map((starValue) => (
                  <IconButton
                    key={starValue}
                    aria-label="Rate Job"
                    icon={
                      <Icon as={starValue <= rating ? FaStar : FaRegStar} />
                    }
                    color={starValue <= rating ? "yellow.400" : "gray.300"}
                    onClick={() => setRating(starValue)}
                  />
                ))}
              </div>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} type="submit">
              Submit
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
