import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
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
} from "@chakra-ui/react";
import useUser from "../../customhooks/useUser";
import { fetchRecruiterDetails } from "../../services/fetchRecruiterDetails";
import { fetchCompanyDetails } from "../../services/fetchCompanyDetails";
export function Details() {
  const { isAuthenticated, loading, userId, token } = useUser();
  const [recruiter, setRecruiter] = useState(null);
  const [company, setCompany] = useState(null);
  const fileInputRef = useRef(null);
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
  console.log("company state", company);
  return (
    <Box width="70%" mx="auto" mt={10} p={5}>
      <Box
        borderWidth="1px"
        rounded="lg"
        shadow="1px 1px 3px rgba(0,0,0,0.3)"
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
              onClick={() => {
                console.log("Avatar clicked");
                document.getElementById("hiddenFileInput").click();
              }}
              cursor="pointer"
            />
            <Input
              type="file"
              id="hiddenFileInput"
              accept="image/*"
              onChange={(event) => {
                console.log("File input changed");
                handleFileChange(event);
              }}
              style={{ display: "none" }}
            />
          </FormControl>
        </Flex>
      </Box>
      <Box
        borderWidth="1px"
        rounded="lg"
        shadow="1px 1px 3px rgba(0,0,0,0.3)"
        maxWidth={800}
        bg="white"
        m="10px auto"
        height="200px"
        borderRadius="12px"
      >
        <VStack
          spacing={4}
          padding="20px"
          alignItems="center"
          bg="transparent"
          maxWidth="100%"
          borderRadius="md"
          shadow="md"
          width="100%"
          margin="0 auto"
        >
          <Heading size="md">
            {company ? company.name : <Spinner size="xs" />}
          </Heading>
          <VStack spacing={3} align="start" w="100%">
            <Text>
              <strong>CEO:</strong>{" "}
              {company ? company.ceoName : <Spinner size="xs" />}
            </Text>
            <Text>
              <strong>Founded:</strong>{" "}
              {company ? company.dateFounded : <Spinner size="xs" />}
            </Text>
            <Text>
              <strong>Industry:</strong>{" "}
              {company ? company.industry : <Spinner size="xs" />}
            </Text>
            <Text>
              <strong>Website:</strong>
              <a
                href={company ? company.webLink : "#"}
                target="_blank"
                rel="noopener noreferrer"
              >
                {company ? company.webLink : <Spinner size="xs" />}
              </a>
            </Text>
          </VStack>
        </VStack>
      </Box>
    </Box>
  );
}
