import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
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
  Th,
  Thead,
  Tr,
  useToast,
} from "@chakra-ui/react";
import React from "react";
import jobTypes from "../../images/jobtypesImg.png";
import { useState } from "react";
import useUser from "../../customhooks/useUser";
import axios from "axios";
import { useEffect } from "react";
import { DeleteIcon } from "@chakra-ui/icons";
import { type } from "@testing-library/user-event/dist/type";
export default function JobTypes() {
  const [jobTypeData, setJobTypeData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const { token } = useUser();
  const [newTypeName, setNewTypeName] = useState("");
  const onClose = () => setIsOpen(false);
  const openModal = () => setIsOpen(true);
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
    const fetchJobTypes = async () => {
      try {
        const response = await axios.get(
          "https://localhost:7013/api/Dashboards/GetAllJobTypes",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setJobTypeData(response.data);
      } catch (error) {
        console.log("There was an error fetching the data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchJobTypes();
  }, []);
  const handleCreateJobType = async () => {
    try {
      const response = await axios.post(
        "https://localhost:7013/api/Dashboards/CreateJobType",
        {
          typeName: newTypeName,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.status === 200) {
        const newId = response.data;

        toastSuccess("Successfully created");
        setJobTypeData((prevLevels) => [
          ...prevLevels,
          { id: newId, typeName: newTypeName },
        ]);
        onClose();
      }
    } catch (error) {
      toastError("Something went wrong");
    }
  };
  const handleDeleteJobType = async (typeId) => {
    console.log(typeId);
    try {
      const response = await axios.delete(
        `https://localhost:7013/api/Dashboards/RemoveJobType?jobTypeId=${typeId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.status === 200) {
        setJobTypeData((prevLevels) =>
          prevLevels.filter((type) => type.id !== typeId)
        );
      }
      toastSuccess("Deleted successfully");
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
        bgImage={jobTypes}
        bgPosition="right"
        shadow="1px 1px 3px rgba(0,0,0,0.3)"
      >
        <Flex alignItems={"center"} ml={"50px"} width={"100%"} height={"100%"}>
          <Heading color={"#2D2D2D"} fontSize={"28px"} as="h5" size="md">
            Review Job Types
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
            <TableCaption>Job Types: {jobTypeData.length}</TableCaption>
            <Thead>
              <Tr>
                <Th>#</Th>
                <Th>Type</Th>
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
                <ModalHeader>Create a new type</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <FormControl>
                    <FormLabel>Job Type</FormLabel>
                    <Input
                      placeholder="Enter new job type "
                      value={newTypeName}
                      onChange={(e) => setNewTypeName(e.target.value)}
                    />
                  </FormControl>
                </ModalBody>

                <ModalFooter>
                  <Button
                    colorScheme="blue"
                    mr={3}
                    onClick={handleCreateJobType}
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
              ) : jobTypeData.length === 0 ? (
                <Tr fontSize="sm">
                  <Td colSpan="6">No job type available</Td>
                </Tr>
              ) : (
                jobTypeData.map((type, index) => (
                  <Tr key={index} fontSize="sm">
                    <Td isNumeric>{index + 1}</Td>
                    <Td>{type.typeName}</Td>
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
                          onClick={() => handleDeleteJobType(type.id)}
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
