import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Avatar,
  Text,
  VStack,
  Flex,
  Spinner,
  Button,
  useBreakpointValue,
} from "@chakra-ui/react";
import profile from "../../images/profile.png";
import useUser from "../../customhooks/useUser";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

export function Profile() {
  const { userId } = useParams();
  const { userDetails, userDetailsLoading, token, userRole } = useUser(userId);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const navigate = useNavigate();
  const buttonSize = useBreakpointValue({ base: "xs", md: "sm" });
  const fileInputRef = useRef(null);
  useEffect(() => {
    setAvatarUrl(userDetails?.avatarUrl);
  }, [userDetails]);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const newAvatarUrl = await uploadAvatar(file, userId);
        const fullUrl = newAvatarUrl[0]?.fullUrl;
        if (fullUrl) {
          await updateAvatarUrlInDB(fullUrl, userId);
          setAvatarUrl(fullUrl);
        }
      } catch (error) {
        console.error("Error while uploading", error);
      }
    }
  };
  const uploadAvatar = async (file, userId) => {
    const formData = new FormData();
    formData.append("containerName", "jobseekers");
    formData.append("files", file);
    formData.append("appUserId", userId);

    try {
      const response = await axios.post(
        "https://localhost:7013/api/Files/Upload",
        formData
      );
      if (response.status === 200) {
        console.log(response.data);
        return response.data;
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };
  const updateAvatarUrlInDB = async (fullUrl, userId) => {
    console.log(fullUrl);
    console.log(userId);
    try {
      await axios.post(
        `https://localhost:7013/api/Jobseeker/UploadAvatar?jobseekerId=${userId}`,
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
        "Failed to update logo URL in the database:",
        error,
        error.response
      );
    }
  };
  return (
    <Box
      width={{ base: "100%", md: "70%" }}
      mx="auto"
      height={"100%"}
      mt={10}
      p={5}
      maxWidth={800}
    >
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
        bgImage={profile}
        bgSize="auto 100%"
        bgPosition="right"
        position="relative"
      >
        <Flex alignItems={"center"} ml={"50px"} width={"100%"} height={"100%"}>
          <input
            type="file"
            id="hiddenFileInput"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
          <Avatar
            size="2xl"
            name={userDetails?.firstName || "User"}
            src={userDetails?.avatarUrl || null}
            onClick={() => fileInputRef.current.click()}
            cursor="pointer"
          />
        </Flex>
      </Box>
      <VStack
        spacing={4}
        padding="20px"
        alignItems="center"
        bg="transparent"
        borderRadius="md"
        shadow="1px 1px 3px rgba(0,0,0,0.6)"
        maxWidth={"100%"}
        width="100%"
        margin="0 auto"
      >
        {userDetailsLoading ? (
          <Text fontSize="xl" color="gray.400">
            <Spinner />
          </Text>
        ) : (
          <>
            <VStack
              spacing={3}
              alignItems={{ base: "center", md: "start" }}
              w={"100%"}
            >
              <Flex
                justifyContent="space-between"
                width="100%"
                flexDirection={{ base: "column", md: "row" }}
              >
                <Text
                  fontSize="2xl"
                  fontWeight="bold"
                  color="gray.700"
                  textAlign={{ base: "center", md: "left" }}
                >
                  {userDetails?.firstName} {userDetails?.lastName}
                </Text>
              </Flex>
              <Flex
                justifyContent="space-between"
                width="100%"
                flexDirection={{ base: "column", md: "row" }}
              >
                <Text
                  fontSize="lg"
                  color="gray.500"
                  mb={{ base: 2, md: 0 }}
                  textAlign={{ base: "center", md: "left" }}
                >
                  Email: {userDetails?.email}
                </Text>
                <Text>Subscription Plan: {userDetails?.subscriptionName}</Text>
                <Button
                  size={buttonSize}
                  colorScheme="blue"
                  onClick={() => {
                    /* Insert logic to open email change form */
                  }}
                >
                  Change Email
                </Button>
              </Flex>
              <Flex
                justifyContent="space-between"
                width="100%"
                flexDirection={{ base: "column", md: "row" }}
              >
                <Text
                  fontSize="lg"
                  color="gray.500"
                  mb={{ base: 2, md: 0 }}
                  textAlign={{ base: "center", md: "left" }}
                >
                  Change your password
                </Text>
                <Button
                  size={buttonSize}
                  colorScheme="blue"
                  onClick={() => {
                    navigate(`/passwordreset/${userId}`);
                  }}
                >
                  Change Password
                </Button>
              </Flex>
              {userRole === "JobSeeker" && (
                <Button>
                  <Link
                    to={`/resumebuild/${userId}`}
                    _hover={{ color: "#2557a7", textDecoration: "underline" }}
                  >
                    Build your Resume
                  </Link>
                </Button>
              )}
            </VStack>
          </>
        )}
      </VStack>
    </Box>
  );
}
