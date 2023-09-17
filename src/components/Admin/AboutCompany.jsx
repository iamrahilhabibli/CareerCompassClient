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
  Textarea,
  Th,
  Thead,
  Tr,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import teamMembersImg from "../../images/teamMembers.png";
import useUser from "../../customhooks/useUser";
import axios from "axios";
import { Link } from "react-router-dom";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
export default function AboutCompany() {
  const [companyTeamData, setCompanyTeamData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const { token, userId } = useUser();
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
  const [newName, setNewName] = useState("");
  const [newSurname, setNewSurname] = useState("");
  const [newPosition, setNewPosition] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newImageUrl, setNewImageUrl] = useState("");
  const uploadImageToServer = async (file, userId, containerName) => {
    const formData = new FormData();
    formData.append("files", file);
    formData.append("appUserId", userId);
    formData.append("containerName", containerName);
    console.log(
      "FormData",
      formData.getAll("files"),
      formData.get("containerName"),
      formData.get("appUserId")
    );
    try {
      const response = await axios.post(
        "https://localhost:7013/api/Files/Upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Server response:", response.data);
      return response.data[0]?.fullUrl || "";
    } catch (error) {
      return "";
    }
  };
  const handleCreateTeamMember = async () => {
    try {
      const uploadedImageURL = await uploadImageToServer(
        newImageUrl,
        userId,
        "teammembers"
      );

      if (!uploadedImageURL) {
        toastError("Image upload failed");
        return;
      }
      const response = await axios.post(
        "https://localhost:7013/api/Dashboards/CreateTeamMember",
        {
          firstName: newName,
          lastName: newSurname,
          position: newPosition,
          description: newDescription,
          imageUrl: uploadedImageURL,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.status === 200) {
        const newId = response.data;
        toastSuccess("Successfully created");
        setCompanyTeamData((team) => [
          ...team,
          {
            id: newId,
            firstName: newName,
            lastName: newSurname,
            position: newPosition,
            description: newDescription,
            imageUrl: uploadedImageURL,
          },
        ]);
        onClose();
      }
    } catch (error) {
      toastError("Something went wrong");
    }
  };
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await axios.get(
          "https://localhost:7013/api/Dashboards/GetMembers",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCompanyTeamData(response.data);
      } catch (error) {
        toastError("Something went wrong please try again");
      } finally {
        setIsLoading(false);
      }
    };
    fetchMembers();
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
        bgImage={teamMembersImg}
        bgPosition="right"
        shadow="1px 1px 3px rgba(0,0,0,0.3)"
      >
        <Flex alignItems={"center"} ml={"50px"} width={"100%"} height={"100%"}>
          <Heading color={"#2D2D2D"} fontSize={"28px"} as="h5" size="md">
            Career Compass Team
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
            <Thead>
              <Tr>
                <Th>#</Th>
                <Th>Name</Th>
                <Th>Surname</Th>
                <Th>Position</Th>
                <Th>Description</Th>
                <Th>Image Url</Th>
                <Th>Action</Th>
                <Th>
                  <Button colorScheme="blue" onClick={openModal}>
                    Add
                  </Button>
                </Th>
              </Tr>
            </Thead>
            <Modal isOpen={isOpen} onClose={onClose}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Add a new team member</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <FormControl>
                    <FormLabel>Name</FormLabel>
                    <Input
                      placeholder="Enter name"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Surname</FormLabel>
                    <Input
                      placeholder="Enter surname"
                      value={newSurname}
                      onChange={(e) => setNewSurname(e.target.value)}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Position</FormLabel>
                    <Input
                      placeholder="Enter position"
                      value={newPosition}
                      onChange={(e) => setNewPosition(e.target.value)}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Description</FormLabel>
                    <Textarea
                      placeholder="Enter description"
                      value={newDescription}
                      onChange={(e) => setNewDescription(e.target.value)}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Upload Image</FormLabel>
                    <Input
                      type="file"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          // You can set the file to a state variable, so it can be uploaded later
                          setNewImageUrl(file);
                        }
                      }}
                    />
                  </FormControl>
                </ModalBody>

                <ModalFooter>
                  <Button
                    colorScheme="blue"
                    mr={3}
                    onClick={handleCreateTeamMember}
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
              ) : companyTeamData.length === 0 ? (
                <Tr fontSize="sm">
                  <Td colSpan="6">No Members available</Td>
                </Tr>
              ) : (
                companyTeamData.map((member, index) => (
                  <Tr key={index} fontSize="sm">
                    <Td isNumeric>{index + 1}</Td>
                    <Td>{member.firstName}</Td>
                    <Td>{member.lastName}</Td>
                    <Td>{member.position}</Td>
                    <Td>
                      <Tooltip
                        label={member.description}
                        placement="top"
                        hasArrow
                      >
                        <span>
                          {member.description.substring(0, 20)}
                          {member.description.length > 20 && "..."}
                        </span>
                      </Tooltip>
                    </Td>
                    <Td>
                      <Link to={member.imageUrl} isExternal>
                        {member.imageUrl
                          ? member.imageUrl.substring(0, 20) + "..."
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
                        <Button
                          colorScheme="yellow"
                          variant="outline"
                          size="xs"
                          borderRadius="full"
                          //   onClick={() => {
                          //     setEditingLevel(level);
                          //     setIsEditModalOpen(true);
                          //   }}
                        >
                          <EditIcon />
                        </Button>
                        <Modal
                        //   isOpen={isEditModalOpen}
                        //   onClose={() => setIsEditModalOpen(false)}
                        >
                          <ModalOverlay />
                          <ModalContent>
                            <ModalHeader>Edit Member</ModalHeader>
                            <ModalCloseButton />
                            <ModalBody>
                              <FormControl>
                                <FormLabel>Name</FormLabel>
                                <Input
                                  placeholder="Enter new level name"
                                  //   value={newLevelName}
                                  //   onChange={(e) =>
                                  //     setNewLevelName(e.target.value)
                                  //   }
                                />
                              </FormControl>
                            </ModalBody>
                            <ModalFooter>
                              <Button
                                colorScheme="blue"
                                mr={3}
                                // onClick={() =>
                                //   handleEditEducationLevel(
                                //     editingLevel.levelId,
                                //     newLevelName
                                //   )
                                // }
                              >
                                Update
                              </Button>
                              <Button
                                variant="ghost"
                                // onClick={() => setIsEditModalOpen(false)}
                              >
                                Cancel
                              </Button>
                            </ModalFooter>
                          </ModalContent>
                        </Modal>

                        <Button
                          colorScheme="red"
                          variant="outline"
                          size="xs"
                          borderRadius="full"
                          //   onClick={() =>
                          //     handleDeleteEducationlevel(level.levelId)
                          //   }
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
