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
} from "@chakra-ui/react";
import { FaStar, FaRegStar } from "react-icons/fa";
import { useFormik } from "formik";
import { useMutation, useQuery, useQueryClient } from "react-query";
import axios from "axios";
import useUser from "../customhooks/useUser";
import { fetchCompanyDetails } from "../services/fetchCompanyDetails";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { StarIcon } from "@chakra-ui/icons";
import * as signalR from "@microsoft/signalr";
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

  // useEffect(() => {
  //   connection.on("ReviewApproved", () => {
  //     queryClient.invalidateQueries("reviews");
  //   });

  //   return () => {
  //     connection.off("ReviewApproved");
  //   };
  // }, [queryClient]);
  const {
    data: { reviews, averageRating } = {},
    isLoading,
    isError,
  } = useQuery(
    ["reviews", companyId],
    () =>
      axios
        .get(
          `https://localhost:7013/api/Reviews/GetAllByCompanyId?companyId=${companyId}`
        )
        .then((res) => res.data),
    {
      staleTime: 1000 * 60,
      refetchInterval: 1000 * 60,
      retry: 1,
    }
  );

  const onClose = () => setIsOpen(false);

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
              display={"flex"}
              flexDirection={{ base: "column", md: "row" }}
              alignItems={"center"}
              justifyContent={"center"}
              gap={"20px"}
              mt={"25px"}
            >
              <Image
                boxSize={{ base: "150px", md: "200px" }}
                objectFit="cover"
                borderRadius="12px"
                boxShadow="0px 4px 10px rgba(0, 0, 0, 0.5)"
                src={company.logoUrl}
                alt={`${company.companyName} logo`}
              />
              <Box
                display={"flex"}
                flexDirection={"column"}
                justifyContent={"center"}
                alignItems={"center"}
                gap={"20px"}
              >
                <Heading mt={{ base: "10px", md: "20px" }}>
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
              justifyContent="center"
              alignItems="center"
              mt={"50px"}
            >
              <Grid templateColumns="repeat(2, 1fr)" gap={5}>
                <GridItem>
                  <Text fontWeight="bold" color="#2557A7">
                    Industry:
                  </Text>
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
                  <Text fontWeight="bold">CEO:</Text>
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
      <Button color={"#2557A7"} onClick={() => setDrawerOpen(true)}>
        See Reviews
      </Button>
      <Drawer
        isOpen={isDrawerOpen}
        placement="right"
        onClose={() => setDrawerOpen(false)}
      >
        <DrawerOverlay>
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader color={"#2557A7"}>Reviews</DrawerHeader>
            <DrawerBody>
              <Box flex="1" bg="gray.100">
                <Divider
                  borderColor="#2557A7"
                  borderWidth="1px"
                  mx="1px"
                  flex="1"
                />
                <Accordion allowToggle>
                  {isLoading ? (
                    <Spinner />
                  ) : isError ? (
                    <Text>Something went wrong...</Text>
                  ) : (
                    reviews.map((review, index) => (
                      <AccordionItem key={index}>
                        <h2>
                          <AccordionButton>
                            <Box flex="1" textAlign="left">
                              <Flex alignItems="center">
                                <Avatar
                                  name={`${review.firstName} ${review.lastName}`}
                                />
                                <Text ml={4}>{review.title}</Text>
                              </Flex>
                            </Box>
                            <Box>
                              {[...Array(5)].map((_, i) => (
                                <StarIcon
                                  key={i}
                                  color={
                                    i < review.rating ? "#2557A7" : "gray.300"
                                  }
                                />
                              ))}
                            </Box>
                            <AccordionIcon />
                          </AccordionButton>
                        </h2>
                        <AccordionPanel pb={4}>
                          <Text>{review.description}</Text>
                        </AccordionPanel>
                      </AccordionItem>
                    ))
                  )}
                </Accordion>
              </Box>
            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
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
