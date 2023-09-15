import {
  Box,
  Button,
  Flex,
  Heading,
  Modal,
  Table,
  TableCaption,
  TableContainer,
  Th,
  Thead,
  useToast,
  Tr,
  Tbody,
  Td,
  Spinner,
  ModalFooter,
  Input,
  FormLabel,
  FormControl,
  ModalBody,
  ModalCloseButton,
  ModalHeader,
  ModalContent,
  ModalOverlay,
} from "@chakra-ui/react";
import axios from "axios";
import joblocationsImg from "../../images/jobLocationsImg.png";
import React, { useEffect, useState } from "react";
import useUser from "../../customhooks/useUser";
import { DeleteIcon } from "@chakra-ui/icons";

export default function NewLocations() {
  const [joblocationsData, setJobLocationsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [locationName, setLocationName] = useState("");
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
  const { token } = useUser();
  useEffect(() => {
    const fetchJobLocations = async () => {
      try {
        const response = await axios.get(
          "https://localhost:7013/api/Dashboards/GetAllJobLocations",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response.data);
        setJobLocationsData(response.data);
      } catch (error) {
        toastError("Something went wrong");
      } finally {
        setIsLoading(false);
      }
    };
    fetchJobLocations();
  }, []);
  const onClose = () => setIsOpen(false);
  const openModal = () => setIsOpen(true);
  const handleCreateJobLocation = async () => {
    try {
      const response = await axios.post(
        "https://localhost:7013/api/Dashboards/CreateJobLocation",
        {
          locationName: locationName,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.status === 200) {
        const newId = response.data;
        toastSuccess("Successfully created");
        setJobLocationsData((prevLevels) => [
          ...prevLevels,
          { id: newId, location: locationName },
        ]);
        onClose();
      }
    } catch (error) {
      toastError("Something went wrong");
    }
  };
  const handleDeleteExperiencelevel = async (locationId) => {
    console.log(locationId);
    try {
      const response = await axios.delete(
        `https://localhost:7013/api/Dashboards/RemoveJobLocation?jobLocationId=${locationId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.status === 200) {
        setJobLocationsData((prevLocations) =>
          prevLocations.filter((location) => location.id !== locationId)
        );
        toastSuccess("Deleted successfully");
      }
    } catch (error) {
      toastError("Something went wrong");
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
        bgImage={joblocationsImg}
        bgPosition="right"
        shadow="1px 1px 3px rgba(0,0,0,0.3)"
      >
        <Flex alignItems={"center"} ml={"50px"} width={"100%"} height={"100%"}>
          <Heading color={"#2D2D2D"} fontSize={"28px"} as="h5" size="md">
            Review Job Locations
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
            <TableCaption>
              Job locations: {joblocationsData.length}
            </TableCaption>
            <Thead>
              <Tr>
                <Th>#</Th>
                <Th>Location</Th>
                <Th>Actions</Th>
                <Th>
                  <Button colorScheme="blue" onClick={openModal}>
                    Create new
                  </Button>
                </Th>
              </Tr>
            </Thead>
            <Modal isOpen={isOpen} onClose={onClose}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Create a new location</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <FormControl>
                    <FormLabel>Location</FormLabel>
                    <Input
                      placeholder="Enter new location "
                      value={locationName}
                      onChange={(e) => setLocationName(e.target.value)}
                    />
                  </FormControl>
                </ModalBody>

                <ModalFooter>
                  <Button
                    colorScheme="blue"
                    mr={3}
                    onClick={handleCreateJobLocation}
                  >
                    Create
                  </Button>
                  <Button variant="ghost" onClick={onClose}>
                    Cancel
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
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
              ) : joblocationsData.length === 0 ? (
                <Tr fontSize="sm">
                  <Td colSpan="6">No Locations available</Td>
                </Tr>
              ) : (
                joblocationsData.map((location, index) => (
                  <Tr key={index} fontSize="sm">
                    <Td isNumeric>{index + 1}</Td>
                    <Td>{location.location}</Td>
                    <Td>
                      <Flex
                        direction="row"
                        spacing={2}
                        gap={"8px"}
                        alignItems={"center"}
                      >
                        <Button
                          colorScheme="red"
                          variant="outline"
                          size="xs"
                          borderRadius="full"
                          onClick={() =>
                            handleDeleteExperiencelevel(location.id)
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
    </Box>
  );
}
