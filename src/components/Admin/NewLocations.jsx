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
} from "@chakra-ui/react";
import axios from "axios";
import joblocationsImg from "../../images/jobLocationsImg.png";
import React, { useEffect, useState } from "react";
import useUser from "../../customhooks/useUser";

export default function NewLocations() {
  const [joblocationsData, setJobLocationsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
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
        setJobLocationsData(response.data);
      } catch (error) {
        toastError("Something went wrong");
      } finally {
        setIsLoading(false);
      }
    };
    fetchJobLocations();
  }, []);
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
              {/* Experience levels: {experienceLevelsData.length} */}
            </TableCaption>
            <Thead>
              <Tr>
                <Th>#</Th>
                <Th>Location</Th>
                <Th>Actions</Th>
                <Th>
                  <Button colorScheme="blue">Create new</Button>
                </Th>
              </Tr>
            </Thead>
            {/* <Modal isOpen={isOpen} onClose={onClose}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Create a new experience level</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <FormControl>
                    <FormLabel>Name</FormLabel>
                    <Input
                      placeholder="Enter new level name"
                      value={newLevelName}
                      onChange={(e) => setNewLevelName(e.target.value)}
                    />
                  </FormControl>
                </ModalBody>

                <ModalFooter>
                  <Button
                    colorScheme="blue"
                    mr={3}
                    onClick={handleCreateExperienceLevel}
                  >
                    Create
                  </Button>
                  <Button variant="ghost" onClick={onClose}>
                    Cancel
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal> */}
            {/* {
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
                ) : experienceLevelsData.length === 0 ? (
                  <Tr fontSize="sm">
                    <Td colSpan="6">No Levels available</Td>
                  </Tr>
                ) : (
                  experienceLevelsData.map((level, index) => (
                    <Tr key={index} fontSize="sm">
                      <Td isNumeric>{index + 1}</Td>
                      <Td>{level.levelName}</Td>
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
                              handleDeleteExperiencelevel(level.id)
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
            } */}
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}
