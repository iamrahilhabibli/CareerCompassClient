import {
  Badge,
  Box,
  Flex,
  Heading,
  Select,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { Divider } from "@chakra-ui/react";
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
import { useState } from "react";
import styles from "./SearchRes.module.css";
import { useSearchParams } from "react-router-dom";
export function SearchResultCards({ searchResults }) {
  const [selectedVacancy, setSelectedVacancy] = useState(null);
  const [dateFilter, setDateFilter] = useState(null);
  const [jobTypeFilter, setJobTypeFilter] = useState([]);
  const [locationFilter, setLocationFilter] = useState(null);
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const jobTitle = decodeURIComponent(searchParams.get("jobTitle"));
  const locationId = searchParams.get("locationId");
  const navigate = useNavigate();
  const [cvFile, setCvFile] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isModalOpen,
    onOpen: onModalOpen,
    onClose: onModalClose,
  } = useDisclosure();

  const {
    data: vacancies,
    isLoading,
    isError,
  } = useVacancies(jobTitle, locationId);

  const filterByDate = (result) => {
    if (!dateFilter) return true;
    const duration = moment().subtract(dateFilter.value, dateFilter.unit);
    return moment(result.dateCreated).isAfter(duration);
  };

  const filterByJobType = (result) => {
    if (jobTypeFilter.length === 0) return true;
    return jobTypeFilter.some((type) => result.jobTypeIds.includes(type));
  };

  const filterByLocation = (result) => {
    return !locationFilter || result.locationName === locationFilter;
  };

  const filteredVacancies = vacancies?.filter(
    (result) =>
      filterByDate(result) &&
      filterByJobType(result) &&
      filterByLocation(result)
  );
  const handleFileChange = (e) => {
    setCvFile(e.target.files[0]);
  };
  const handleApplication = async () => {
    if (cvFile) {
      // Send the file to the backend (Azure Blob Storage)
      const formData = new FormData();
      formData.append("file", cvFile);

      const response = await fetch("/api/cv", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        // Proceed with the application
        // Redirect or show success message
        console.log("CV uploaded successfully");
        onModalClose();
      } else {
        console.log("Error uploading CV");
      }
    } else {
      // Handle the case where CV is not provided (if it's required)
      console.log("Please upload a CV");
    }
  };
  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center">
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
      <Box>
        <Button size={"sm"}>Date Created</Button>
        <Button>Job location</Button>
        <Button>Job Type</Button>
      </Box>
      <Flex flexDirection={"column"} maxWidth={"60%"}>
        <Box display="flex" flexWrap="wrap" justifyContent="space-around">
          {vacancies?.map((result) => (
            <Box
              className={styles.Container}
              key={result.id}
              borderWidth="1px"
              borderRadius="lg"
              overflow="hidden"
              m={4}
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
                  isTruncated
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

      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay>
          <DrawerContent>
            <DrawerHeader>{selectedVacancy?.jobTitle}</DrawerHeader>
            <DrawerBody>
              <Text fontSize="16px" color="gray.500" fontWeight={300}>
                {selectedVacancy?.companyName}
              </Text>
              <Divider my={3} />
              <Text fontSize="16px" color="gray.500" fontWeight={300}>
                {selectedVacancy?.locationName}
              </Text>
              <Divider my={3} />
              <Badge fontWeight={600} mr={1} mb={3} colorScheme="gray" p={2}>
                ${selectedVacancy?.salary}
              </Badge>
              <Divider my={3} />
              {selectedVacancy?.jobTypeIds?.map((jobType, index) => (
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
            <DrawerFooter display={"flex"} justifyContent={"space-between"}>
              <Button
                colorScheme="blue"
                variant={"outline"}
                mr={3}
                onClick={onModalOpen}
              >
                Apply
              </Button>
              <Button variant="outline" mr={3} onClick={onClose}>
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
            <Button colorScheme="blue" mr={3} onClick={onModalClose}>
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
