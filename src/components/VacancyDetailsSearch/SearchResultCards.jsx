import {
  Badge,
  Box,
  Flex,
  Heading,
  RangeSlider,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  RangeSliderTrack,
  Select,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import * as signalR from "@microsoft/signalr";
import { Divider } from "@chakra-ui/react";
import { updateApplicationCount } from "../../reducers/jobVacancySlice";
import { AttachmentIcon } from "@chakra-ui/icons";
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
} from "@chakra-ui/react";

import { useLocation, useNavigate } from "react-router-dom";
import { Link as ChakraLink } from "@chakra-ui/react";
import { useVacancies } from "../../services/getVacancies";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import moment from "moment";
import { useMemo, useState } from "react";
import styles from "./SearchRes.module.css";
import { useSearchParams } from "react-router-dom";
import useUser from "../../customhooks/useUser";
import axios from "axios";
import { fetchJobSeekerDetails } from "../../services/fetchJobSeekerDetails";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
export function SearchResultCards({ searchResults }) {
  const [selectedVacancy, setSelectedVacancy] = useState(null);
  const [dateFilter, setDateFilter] = useState(null);
  const [jobTypeFilter, setJobTypeFilter] = useState([]);
  const [jobSeekerId, setJobSeekerId] = useState(null);
  const { userId, token, isAuthenticated, userRole } = useUser();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const toast = useToast();
  const [locationFilter, setLocationFilter] = useState(null);
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const jobTitle = decodeURIComponent(searchParams.get("jobTitle"));
  const locationId = searchParams.get("locationId");
  const navigate = useNavigate();
  const [cvFile, setCvFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [sortOrder, setSortOrder] = useState("asc");
  const [jobType, setJobType] = useState("");
  const {
    isOpen: isModalOpen,
    onOpen: onModalOpen,
    onClose: onModalClose,
  } = useDisclosure();
  const dispatch = useDispatch();

  const {
    data: vacancies,
    isLoading,
    isError,
  } = useVacancies(jobTitle, locationId, sortOrder, jobType);

  const toggleSortOrder = () => {
    const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newSortOrder);

    const newUrl = `/search?jobTitle=${jobTitle}&locationId=${locationId}&sortOrder=${newSortOrder}`;
    navigate(newUrl);
  };
  const handleJobTypeChange = (newJobType) => {
    setJobType(newJobType);

    const newUrl = `/search?jobTitle=${jobTitle}&locationId=${locationId}&sortOrder=${sortOrder}&jobType=${newJobType}`;
    navigate(newUrl);
  };

  useEffect(() => {
    const fetchData = async () => {
      const jobSeekerDetails = await fetchJobSeekerDetails(userId, token);
      if (jobSeekerDetails) {
        setJobSeekerId(jobSeekerDetails.id);
      }
    };
    fetchData();
  }, [userId, token]);
  const pageCount = Math.ceil(vacancies?.length / itemsPerPage);

  const displayedVacancies = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return vacancies?.slice(startIndex, startIndex + itemsPerPage);
  }, [currentPage, vacancies]);

  const handleFileChange = (e) => {
    setCvFile(e.target.files[0]);
  };
  const [applicationLimit, setApplicationLimit] = useState(0);
  const [currentApplicationCount, setCurrentApplicationCount] = useState(0);
  const moment = require("moment-timezone");

  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:7013/application")
      .build();

    const start = async () => {
      try {
        await connection.start();
        console.log("SignalR Connected");
      } catch (err) {
        console.log(err);
        setTimeout(() => start(), 5000);
      }
    };
    connection.on("ReceiveApplicationUpdate", (updatedCount) => {
      setCurrentApplicationCount(updatedCount);
      dispatch(updateApplicationCount(updatedCount));
    });
    start();
    return () => {
      connection.stop();
    };
  }, []);

  useEffect(() => {
    if (selectedVacancy) {
      setApplicationLimit(selectedVacancy.applicationLimit);
      setCurrentApplicationCount(selectedVacancy.currentApplicationCount);
      dispatch(updateApplicationCount(selectedVacancy.currentApplicationCount));
    }
  }, [selectedVacancy]);
  const handleApplication = async () => {
    if (!isAuthenticated) {
      toast({
        title: "You must sign in with your account first.",
        status: "warning",
        duration: 3000,
        isClosable: true,
        onCloseComplete: () => {
          navigate("/signin");
        },
      });
      return;
    }
    if (cvFile) {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("containerName", "resume");
      formData.append("files", cvFile);
      formData.append("appUserId", userId);

      try {
        const response = await axios.post(
          `https://localhost:7013/api/Files/Upload?appUserId=${userId}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.status === 200) {
          await axios.post(`https://localhost:7013/api/JobApplications/Post`, {
            vacancyId: selectedVacancy.id,
            jobSeekerId: jobSeekerId,
          });
          toast({
            title: "Success.",
            description: "You have successfully applied for this position!",
            status: "success",
            duration: 5000,
            isClosable: true,
            position: "top-right",
          });
          setIsUploading(false);
          onModalClose();
        } else {
          toast({
            title: "Error.",
            description: "Error uploading.",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "top-right",
          });
          setIsUploading(false);
        }
      } catch (error) {
        console.error("Something went wrong:", error);
        toast({
          title: "Oops something went wrong.",
          description: `Something went wrong please try again later`,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });
        setIsUploading(false);
      }
    } else {
      toast({
        title: "Warning.",
        description: "Please upload a CV.",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    }
  };

  if (isLoading) {
    return (
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
    );
  }

  if (isError) {
    navigate("/somethingwentwrong");
  }
  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="gray.100"
        p={4}
        borderRadius="md"
        shadow="md"
      >
        <Button
          onClick={toggleSortOrder}
          colorScheme="teal"
          variant="outline"
          size="md"
          px={4}
        >
          Date Created
        </Button>
        <Select
          variant="outline"
          placeholder="Select Job Type"
          w="200px"
          borderColor="gray.300"
          onChange={(e) => handleJobTypeChange(e.target.value)}
          value={jobType}
        >
          <option value="All">All</option>
          <option value="PartTime">Part-Time</option>
          <option value="FullTime">Full-Time</option>
          <option value="Contract">Contract</option>
          <option value="Temporary">Temporary</option>
          <option value="Internship">Internship</option>
        </Select>
      </Box>

      <Flex flexDirection={"column"} maxWidth={"60%"}>
        <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={6}>
          {displayedVacancies?.map((result) => (
            <Box
              className={styles.Container}
              key={result.id}
              borderWidth="1px"
              borderRadius="lg"
              overflow="hidden"
              m={4}
              boxShadow="0px 4px 6px #d1d5db"
              onClick={() => {
                setSelectedVacancy(result);
                onOpen();
              }}
              cursor="pointer"
            >
              <Box p="6">
                <Text
                  fontSize="18px"
                  fontWeight="600"
                  mt="1"
                  lineHeight="tight"
                  bg="teal.600"
                  color="white"
                  p={2}
                  boxShadow="0px 2px 4px #319795"
                  borderRadius="md"
                  _hover={{ textDecoration: "underline" }}
                >
                  {result.jobTitle}
                </Text>
                <Text fontSize={"16px"} color="gray.500" fontWeight={300}>
                  {result.companyName}
                </Text>
                <Text
                  fontSize={"16px"}
                  color="gray.500"
                  fontWeight={300}
                  mb={3}
                >
                  {result.locationName}
                </Text>
                <Badge fontWeight={600} mr={1} mb={3} colorScheme="gray" p={2}>
                  ${result.salary}
                </Badge>
                <br />
                {result.jobTypeIds.map((jobType, index) => (
                  <Badge
                    fontWeight={600}
                    key={index}
                    mr={1}
                    mb={3}
                    colorScheme="gray"
                    p={2}
                  >
                    {jobType}
                  </Badge>
                ))}
                <div
                  className={styles.Description}
                  dangerouslySetInnerHTML={{
                    __html: `${result.description.substring(0, 50)}`,
                  }}
                />
                <ChakraLink
                  color={"blue.400"}
                  href={result.companyLink}
                  isExternal
                >
                  <ExternalLinkIcon mx="2px" />
                </ChakraLink>
                <Flex justifyContent="space-between">
                  <Text fontSize="xs" color="gray.500">
                    {moment(result.dateCreated).local().fromNow()}
                  </Text>
                </Flex>
              </Box>
            </Box>
          ))}
        </Box>
      </Flex>

      <Flex
        justifyContent="center"
        mt={4}
        bg="gray.100"
        p={4}
        borderRadius="md"
        shadow="md"
      >
        <Button
          onClick={() => setCurrentPage((page) => Math.max(page - 1, 1))}
          colorScheme="teal"
          variant="outline"
          size="md"
          isDisabled={currentPage === 1}
        >
          Previous
        </Button>
        <Text mx={4} fontSize="xl" fontWeight="bold">
          Page {currentPage} of {pageCount}
        </Text>
        <Button
          onClick={() =>
            setCurrentPage((page) => Math.min(page + 1, pageCount))
          }
          colorScheme="teal"
          variant="outline"
          size="md"
          isDisabled={currentPage === pageCount}
        >
          Next
        </Button>
      </Flex>

      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay>
          <DrawerContent>
            <DrawerHeader bg="teal.500" color="white">
              {selectedVacancy?.jobTitle}
            </DrawerHeader>
            <DrawerBody py={4} px={6}>
              <Text fontSize="16px" color="gray.600" fontWeight={500} mb={3}>
                {selectedVacancy?.companyName}
              </Text>
              <Divider my={3} />
              <Text fontSize="16px" color="gray.600" fontWeight={500} mb={3}>
                {selectedVacancy?.locationName}
              </Text>
              <Divider my={3} />
              <Badge fontWeight={600} colorScheme="blue" p={2}>
                ${selectedVacancy?.salary}
              </Badge>
              <Divider my={3} />
              {selectedVacancy?.jobTypeIds?.map((jobType, index) => (
                <Badge
                  fontWeight={600}
                  key={index}
                  mr={1}
                  mb={3}
                  colorScheme="green"
                  p={2}
                >
                  {jobType}
                </Badge>
              ))}
              <Divider my={3} />
              <div
                style={{
                  maxHeight: "200px",
                  overflowY: "auto",
                }}
                dangerouslySetInnerHTML={{
                  __html: selectedVacancy?.description,
                }}
              />
            </DrawerBody>
            <DrawerFooter
              display={"flex"}
              justifyContent={"space-between"}
              py={4}
            >
              <Button
                colorScheme="blue"
                variant={"solid"}
                mr={3}
                onClick={onModalOpen}
                isDisabled={currentApplicationCount >= applicationLimit}
              >
                Apply
              </Button>
              <Button variant="outline" colorScheme="gray" onClick={onClose}>
                Close
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>

      <Modal isOpen={isModalOpen} onClose={onModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Apply for {selectedVacancy?.jobTitle}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb={4}>
              Do you wish to continue with the application for this vacancy?
              Please be advised that failure to respond to applications may
              result in the suspension of your account.
            </Text>
            <FormControl>
              <FormLabel>Upload your CV:</FormLabel>
              <label>
                <Input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  display="none"
                  id="cvFile"
                />
                <Button
                  as="span"
                  colorScheme="blue"
                  leftIcon={<AttachmentIcon />}
                >
                  Choose File
                </Button>
              </label>
              {cvFile && <Text mt={2}>File selected: {cvFile.name}</Text>}
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleApplication}>
              Confirm Application
            </Button>
            <Button variant="outline" onClick={onModalClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
