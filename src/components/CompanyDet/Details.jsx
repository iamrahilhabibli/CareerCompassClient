import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import {
  SettingsIcon,
  CalendarIcon,
  InfoOutlineIcon,
  LinkIcon,
  EditIcon,
  TextIcon,
  LocationIcon,
  QuestionIcon,
  AtSignIcon,
} from "@chakra-ui/icons";
import profileImg from "../../images/profile.png";
import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Flex,
  Heading,
  Spinner,
  Text,
  VStack,
  Image,
  Input,
  Avatar,
  FormLabel,
  FormControl,
  SimpleGrid,
  useDisclosure,
  Icon,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  GridItem,
  useToast,
} from "@chakra-ui/react";
import useUser from "../../customhooks/useUser";
import { fetchRecruiterDetails } from "../../services/fetchRecruiterDetails";
import { fetchCompanyDetails } from "../../services/fetchCompanyDetails";
import { Link } from "react-router-dom";
export function Details() {
  const { isAuthenticated, loading, userId, token } = useUser();
  const [recruiter, setRecruiter] = useState(null);
  const [company, setCompany] = useState(null);
  const fileInputRef = useRef(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const getRecruiterDetails = useCallback(async () => {
    if (isAuthenticated && !loading && userId && token) {
      try {
        const recruiterData = await fetchRecruiterDetails(userId, token);
        setRecruiter(recruiterData);
        if (recruiterData.companyId) {
          const companyData = await fetchCompanyDetails(
            recruiterData.companyId,
            token
          );
          setCompany(companyData);
        }
      } catch (error) {
        console.error("Error fetching details:", error);
      }
    }
  }, [isAuthenticated, loading, userId, token]);

  useEffect(() => {
    getRecruiterDetails();
  }, [getRecruiterDetails]);
  const updateCompanyLogoInDB = async (fullUrl, companyId) => {
    try {
      await axios.post(
        `https://localhost:7013/api/Companies/UploadLogo?companyId=${companyId}`,
        {
          url: fullUrl,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error(
        // Toast error must be added
        "Failed to update logo URL in the database:",
        error,
        error.response
      );
    }
  };
  const updateCompanyDetails = async (
    companyDetailsUpdateDto,
    onClose,
    token
  ) => {
    try {
      const response = await axios.put(
        "https://localhost:7013/api/Companies/UpdateDetails",
        companyDetailsUpdateDto,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setCompany((prevCompany) => ({
          ...prevCompany,
          ...companyDetailsUpdateDto,
        }));
        toast({
          title: "Success!",
          description: "Company details updated successfully.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "An error occurred.",
        description: "Something went wrong while updating the company details.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
    onClose();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const newLogoUrl = await uploadLogo(file, userId, token);
        const fullUrl = newLogoUrl[0]?.fullUrl;
        console.log(fullUrl);
        if (fullUrl) {
          setCompany((prevState) => ({ ...prevState, logoUrl: fullUrl }));
          if (company) {
            updateCompanyLogoInDB(fullUrl, company.companyId);
          }
        } else {
          console.error("The fullUrl property is not available.");
        }
      } catch (error) {
        console.error("Error while uploading", error);
      }
    }
  };
  const [companyName, setCompanyName] = useState(company?.name);
  const [ceoName, setCeoName] = useState(company?.ceoName);
  const [webLink, setWebLink] = useState(company?.webLink);
  const [address, setAddress] = useState(company?.address);
  const [description, setDescription] = useState(company?.description);
  useEffect(() => {
    setCompanyName(company?.name);
    setCeoName(company?.ceoName);
    setWebLink(company?.webLink);
    setAddress(company?.address);
    setDescription(company?.description);
  }, [company]);

  useEffect(() => {
    const inputElement = fileInputRef.current;
    if (inputElement) {
      inputElement.addEventListener("change", handleFileChange);
    }
    return () => {
      if (inputElement) {
        inputElement.removeEventListener("change", handleFileChange);
      }
    };
  }, [handleFileChange]);

  const uploadLogo = async (file, userId, token) => {
    const formData = new FormData();
    formData.append("containerName", "recruiters");
    formData.append("files", file);
    formData.append("appUserId", userId);

    try {
      const response = await axios.post(
        "https://localhost:7013/api/Files/Upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        console.log("this is response", response);
        console.log("Entire server response:", response);
        return response.data;
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      if (error.response && error.response.data) {
        console.error("Server Response:", error.response.data);
      }
    }
  };

  if (loading) {
    return (
      <Flex justifyContent="center" alignItems="center" height="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  return (
    <Box width="100%" height="100vh" mx="auto" mt={10} p={5}>
      <Box
        borderWidth="1px"
        rounded="lg"
        shadow="1px 1px 3px rgba(0, 0, 0, 0.3)"
        maxWidth={800}
        bg="white"
        m="10px auto"
        height="200px"
        borderRadius="12px"
        bgRepeat="no-repeat"
        bgImage={`url(${profileImg})`}
        bgSize="auto 100%"
        bgPosition="right"
        position="relative"
      >
        <Flex alignItems="center" ml="50px" width="100%" height="100%">
          <FormControl id="upload-logo" position="relative">
            <Avatar
              size="2xl"
              src={company?.logoUrl || "default_logo.jpg"}
              onClick={() => document.getElementById("hiddenFileInput").click()}
              cursor="pointer"
            />
            <Input
              type="file"
              id="hiddenFileInput"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
          </FormControl>
        </Flex>
      </Box>
      <Box
        borderWidth="1px"
        rounded="lg"
        shadow="1px 1px 3px rgba(0, 0, 0, 0.3)"
        maxWidth={800}
        bg="white"
        m="10px auto"
        height="auto"
        borderRadius="12px"
        p={4}
      >
        <VStack spacing={4} padding="20px" alignItems="center">
          <Flex align="center" justifyContent="space-between" width="100%">
            <Heading
              size="lg"
              color="blue.700"
              fontWeight="extrabold"
              textAlign="center"
              mt={5}
            >
              {company ? company.name : <Spinner size="xs" />}
            </Heading>
            <EditIcon
              boxSize="1.5em"
              color="blue.500"
              cursor="pointer"
              onClick={onOpen}
            />
          </Flex>

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} w="100%">
            {[
              { value: "ceoName", icon: <InfoOutlineIcon /> },
              { value: "dateFounded", icon: <CalendarIcon /> },
              { value: "industry", icon: <SettingsIcon /> },
              { value: "webLink", icon: <LinkIcon />, isLink: true },
              { value: "address", icon: <AtSignIcon /> },
            ].map((item, index) => (
              <Box key={index}>
                <Flex alignItems="center">
                  {item.icon}
                  <Text ml={2} fontSize="lg">
                    {company ? (
                      item.isLink ? (
                        <Link href={company[item.value]} isExternal>
                          {company[item.value]}
                        </Link>
                      ) : (
                        company[item.value]
                      )
                    ) : (
                      <Spinner size="xs" />
                    )}
                  </Text>
                </Flex>
              </Box>
            ))}
            <GridItem colSpan={{ base: 1, md: 2 }}>
              <Flex alignItems="center">
                <QuestionIcon />
                <Text ml={2} fontSize="lg" fontWeight="extrabold">
                  Description:
                </Text>
              </Flex>
              <Box mt={3} height="100px" overflowY="auto">
                <Text fontSize="lg">
                  {company ? company.description : <Spinner size="xs" />}
                </Text>
              </Box>
            </GridItem>
          </SimpleGrid>
        </VStack>
      </Box>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Company Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Company Name</FormLabel>
              <Input
                defaultValue={company?.name}
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>CEO Name</FormLabel>
              <Input
                defaultValue={company?.ceoName}
                value={ceoName}
                onChange={(e) => setCeoName(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Website</FormLabel>
              <Input
                defaultValue={company?.webLink}
                value={webLink}
                onChange={(e) => setWebLink(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Company Address</FormLabel>
              <Input
                defaultValue={company?.address}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Company Description</FormLabel>
              <Input
                defaultValue={company?.description}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={() => {
                const companyDetailsUpdateDto = {
                  id: company.companyId,
                  companyName: companyName,
                  ceoName: ceoName,
                  webLink: webLink,
                  address: address,
                  description: description,
                };
                updateCompanyDetails(companyDetailsUpdateDto, onClose, token);
              }}
            >
              Save
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
