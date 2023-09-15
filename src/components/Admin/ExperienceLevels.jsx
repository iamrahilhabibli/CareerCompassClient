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
import experienceImg from "../../images/experienceImg.png";
import useUser from "../../customhooks/useUser";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
export default function ExperienceLevels() {
  const toast = useToast();
  const { token } = useUser();
  const [experienceLevelsData, setExperienceLevelsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [newLevelName, setNewLevelName] = useState("");
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
    const fetchExperienceLevel = async () => {
      try {
        const response = await axios.get(
          "https://localhost:7013/api/Dashboards/GetExperienceLevels",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setExperienceLevelsData(response.data);
      } catch (error) {
        toastError("Something went wrong");
      } finally {
        setIsLoading(false);
      }
    };
    fetchExperienceLevel();
  }, []);
  const onClose = () => setIsOpen(false);
  const openModal = () => setIsOpen(true);
  const handleCreateExperienceLevel = async () => {
    try {
      const response = await axios.post(
        "https://localhost:7013/api/Dashboards/CreateExperienceLevel",
        {
          name: newLevelName,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.status === 200) {
        const newId = response.data;
        toastSuccess("Successfully created");
        setExperienceLevelsData((prevLevels) => [
          ...prevLevels,
          { id: newId, levelName: newLevelName },
        ]);
        onClose();
      }
    } catch (error) {
      toastError("Something went wrong");
    }
  };

  console.log(experienceLevelsData);
  const handleDeleteExperiencelevel = async (levelId) => {
    console.log(levelId);
    try {
      const response = await axios.delete(
        `https://localhost:7013/api/Dashboards/RemoveExperienceLevel?levelId=${levelId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.status === 200) {
        setExperienceLevelsData((prevLevels) =>
          prevLevels.filter((level) => level.id !== levelId)
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
        bgImage={experienceImg}
        bgPosition="right"
        shadow="1px 1px 3px rgba(0,0,0,0.3)"
      >
        <Flex alignItems={"center"} ml={"50px"} width={"100%"} height={"100%"}>
          <Heading color={"#2D2D2D"} fontSize={"28px"} as="h5" size="md">
            Review experience levels
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
              Experience levels: {experienceLevelsData.length}
            </TableCaption>
            <Thead>
              <Tr>
                <Th>#</Th>
                <Th>Level Name</Th>
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
            </Modal>
            {
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
                            colorScheme="yellow"
                            variant="outline"
                            size="xs"
                            borderRadius="full"
                            // onClick={() => {
                            //   setEditingLevel(level);
                            //   setIsEditModalOpen(true);
                            // }}
                          >
                            <EditIcon />
                          </Button>
                          {/* <Modal
                            isOpen={isEditModalOpen}
                            onClose={() => setIsEditModalOpen(false)}
                          >
                            <ModalOverlay />
                            <ModalContent>
                              <ModalHeader>Edit Education Level</ModalHeader>
                              <ModalCloseButton />
                              <ModalBody>
                                <FormControl>
                                  <FormLabel>Name</FormLabel>
                                  <Input
                                    placeholder="Enter new level name"
                                    value={newLevelName}
                                    onChange={(e) =>
                                      setNewLevelName(e.target.value)
                                    }
                                  />
                                </FormControl>
                              </ModalBody>
                              <ModalFooter>
                                <Button
                                  colorScheme="blue"
                                  mr={3}
                                  onClick={() =>
                                    handleEditEducationLevel(
                                      editingLevel.levelId,
                                      newLevelName
                                    )
                                  }
                                >
                                  Update
                                </Button>
                                <Button
                                  variant="ghost"
                                  onClick={() => setIsEditModalOpen(false)}
                                >
                                  Cancel
                                </Button>
                              </ModalFooter>
                            </ModalContent>
                          </Modal> */}

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
            }
          </Table>
        </TableContainer>
      </Box>
      {/* <AlertDialog
            isOpen={isAlertDialogOpen}
            onClose={() => setAlertDialogOpen(false)}
          >
            <AlertDialogOverlay>
              <AlertDialogContent>
                <AlertDialogHeader fontSize="lg" fontWeight="bold">
                  Delete User
                </AlertDialogHeader>
                <AlertDialogBody>
                  Are you sure you want to delete this company? This action cannot
                  be undone.
                </AlertDialogBody>
                <AlertDialogFooter>
                  <Button onClick={() => setAlertDialogOpen(false)}>Cancel</Button>
                  <Button colorScheme="red" onClick={executeCompanyDeletion} ml={3}>
                    Delete
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialogOverlay>
          </AlertDialog> */}
    </Box>
  );
}
