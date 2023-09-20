import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
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
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useToast,
  CloseButton,
} from "@chakra-ui/react";
import React, { useState } from "react";
import resumeImg from "../../images/resumeImg.png";
import useUser from "../../customhooks/useUser";
import axios from "axios";
import { useEffect } from "react";
import { Editor } from "@tinymce/tinymce-react";

export default function ResumeControl() {
  const [isLoading, setIsLoading] = useState(true);
  const [resumeData, setResumeData] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const { token, userId } = useUser();
  const [isBoxOpen, setIsBoxOpen] = useState(false);
  const openBox = () => setIsBoxOpen(true);
  const closeBox = () => setIsBoxOpen(false);
  const [newResumeName, setNewResumeName] = useState("");
  const [newResumePrice, setNewResumePrice] = useState(0.0);
  const [newResumeDescription, setNewResumeDescription] = useState("");
  const [newResumeStructure, setNewResumeStructure] = useState("");
  const onClose = () => setIsOpen(false);
  const openModal = () => setIsOpen(true);
  const toast = useToast();
  const handleClose = () => {
    setIsBoxOpen(false);
  };
  const handleCancel = () => {
    setIsBoxOpen(false);
  };
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
    const fetchResumes = async () => {
      try {
        const response = await axios.get(
          "https://localhost:7013/api/Dashboards/GetResumes",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setResumeData(response.data);
      } catch (error) {
        toastError("Something went wrong please try again");
      } finally {
        setIsLoading(false);
      }
    };
    fetchResumes();
  }, []);
  const handleCreateResume = async () => {
    try {
      const response = await axios.post(
        "https://localhost:7013/api/Resumes/CreateResume",
        {
          name: newResumeName,
          price: newResumePrice,
          desciption: newResumeDescription,
          structure: newResumeStructure,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.status === 200) {
        const newId = response.data;
        toastSuccess("Successfully created");
        setResumeData((resume) => [
          ...resume,
          {
            name: newResumeName,
            price: newResumePrice,
            desciption: newResumeDescription,
            structure: newResumeStructure,
          },
        ]);
        onClose();
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
        bgImage={resumeImg}
        bgPosition="right"
        shadow="1px 1px 3px rgba(0,0,0,0.3)"
      >
        <Flex alignItems={"center"} ml={"50px"} width={"100%"} height={"100%"}>
          <Heading color={"#2D2D2D"} fontSize={"28px"} as="h5" size="md">
            Resume Plans
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
                <Th>Price</Th>
                <Th>Description</Th>
                <Th>HTML Structure</Th>
                <Th>Action</Th>
                <Th>
                  <Button colorScheme="blue" onClick={openBox}>
                    Add
                  </Button>
                </Th>
              </Tr>
            </Thead>
            {isBoxOpen && (
              <Box
                position="fixed"
                top="50%"
                left="50%"
                transform="translate(-50%, -50%)"
                width="80%"
                boxShadow="md"
                p={4}
                rounded="md"
                bg="white"
                zIndex={2}
              >
                <Box display="flex" justifyContent="space-between">
                  <Heading size="md">Create a new Resume Plan</Heading>
                  <CloseButton onClick={handleClose} />
                </Box>

                <FormControl mt={4}>
                  <FormLabel>Name</FormLabel>
                  <Input
                    placeholder="Enter name"
                    value={newResumeName}
                    onChange={(e) => setNewResumeName(e.target.value)}
                  />
                </FormControl>

                <FormControl mt={4}>
                  <FormLabel>Price</FormLabel>
                  <Input
                    placeholder="Enter price"
                    value={newResumePrice}
                    onChange={(e) => setNewResumePrice(e.target.value)}
                  />
                </FormControl>

                <FormControl mt={4}>
                  <FormLabel>Description</FormLabel>
                  <Input
                    placeholder="Enter description"
                    value={newResumeDescription}
                    onChange={(e) => setNewResumeDescription(e.target.value)}
                  />
                </FormControl>

                <Box mt={4}>
                  <Editor
                    apiKey="ampk5o36dpm7qqhr2h54evb0g8b4fqptomyoa5ntgpubk2h4"
                    id="structure"
                    init={{
                      height: 300,
                      width: "100%",
                      menubar: false,
                      plugins:
                        "advlist autolink lists link image charmap print preview anchor searchreplace visualblocks code fullscreen insertdatetime media table paste code help wordcount",
                      toolbar:
                        "undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help",
                    }}
                    onEditorChange={(content) => {
                      setNewResumeStructure(content);
                    }}
                    onInit={() => setIsLoading(false)}
                  />
                </Box>

                <Box mt={4} display="flex" justifyContent="flex-end">
                  <Button
                    colorScheme="blue"
                    mr={3}
                    onClick={handleCreateResume}
                  >
                    Create
                  </Button>
                  <Button variant="ghost" onClick={handleCancel}>
                    Cancel
                  </Button>
                </Box>
              </Box>
            )}

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
              ) : resumeData?.length === 0 ? (
                <Tr fontSize="sm">
                  <Td colSpan="6">No resumes available</Td>
                </Tr>
              ) : (
                resumeData.map((resume, index) => (
                  <Tr key={index} fontSize="sm">
                    <Td isNumeric>{index + 1}</Td>
                    <Td>{resume.firstName}</Td>
                    <Td>{resume.lastName}</Td>
                    <Td>{resume.position}</Td>
                    {/* <Td>
                      <Tooltip
                        label={resume.description}
                        placement="top"
                        hasArrow
                      >
                        <span>
                          {member.description.substring(0, 20)}
                          {member.description.length > 20 && "..."}
                        </span>
                      </Tooltip>
                    </Td> */}
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
                        {/* <Modal
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
                        </Modal> */}

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
