import React from "react";
import {
  Box,
  Flex,
  Heading,
  Button,
  FormControl,
  FormLabel,
  Input,
  Avatar,
} from "@chakra-ui/react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import userFeedbackImg from "../../images/userFeedback.png";
import useUser from "../../customhooks/useUser";
import axios from "axios";

const initialValues = {
  avatar: undefined,
  firstName: "",
  lastName: "",
  description: "",
  jobTitle: "",
};

const validationSchema = Yup.object({
  firstName: Yup.string().required("Required"),
  lastName: Yup.string().required("Required"),
  description: Yup.string().required("Required"),
  jobTitle: Yup.string().required("Required"),
});

const UserFeedback = () => {
  const [avatarPreview, setAvatarPreview] = React.useState(null);
  const { userId, userRole } = useUser();

  const uploadImageToServer = async (file, userId, userRole) => {
    const formData = new FormData();
    formData.append("files", file);
    const modifiedUserRole = `${userRole.toLowerCase()}s`;
    formData.append("containerName", modifiedUserRole);
    formData.append("appUserId", userId);
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
      console.error("File upload failed", error);
      return "";
    }
  };

  const handleAvatarChange = (e, setFieldValue) => {
    const file = e.target.files[0];
    console.log("Selected file: ", file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
      setFieldValue("avatar", file);
    }
  };

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    console.log("handleSubmit called");
    try {
      const uploadedImageURL = await uploadImageToServer(
        values.avatar,
        userId,
        userRole
      );
      console.log("uploadedImageURL:", uploadedImageURL);

      if (!uploadedImageURL) {
        setFieldError(
          "avatar",
          "Could not upload the image. Please try again."
        );
        return;
      }
      const payload = {
        firstName: values.firstName,
        lastName: values.lastName,
        description: values.description,
        imageUrl: uploadedImageURL,
        jobTitle: values.jobTitle,
      };
      console.log("Payload before sending:", payload);
      await axios.post("https://localhost:7013/api/Feedbacks/Post", payload);
      console.log("Feedback sent successfully");
    } catch (error) {
      console.log("Error sending feedback:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
      rounded="lg"
      maxWidth={800}
      m="10px auto"
      borderRadius="12px"
      p={4}
      bg="transparent"
    >
      <Box
        borderWidth="1px"
        rounded="lg"
        height="200px"
        bg="white"
        bgRepeat="no-repeat"
        bgSize="auto 100%"
        bgImage={userFeedbackImg}
        bgPosition="right"
        shadow="1px 1px 3px rgba(0,0,0,0.3)"
      >
        <Flex alignItems="center" ml="50px" width="100%" height="100%">
          <Heading color="#2D2D2D" fontSize="28px" as="h5">
            Share Your Feedback
          </Heading>
        </Flex>
      </Box>
      <Box my={4}>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, setFieldValue }) => (
            <Form>
              <Box
                borderWidth="1px"
                rounded="lg"
                bg="white"
                shadow="1px 1px 3px rgba(0,0,0,0.3)"
                p={4}
              >
                <FormControl
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  mb={4}
                >
                  <Avatar size={"xl"} src={avatarPreview} />
                  <Input
                    type="file"
                    style={{ display: "none" }}
                    id="avatar-input"
                    onChange={(e) =>
                      handleAvatarChange(e, setFieldValue, userId, userRole)
                    }
                  />
                  <FormLabel
                    htmlFor="avatar-input"
                    as="label"
                    style={{ cursor: "pointer" }}
                    bg="teal.500"
                    color="white"
                    p={2}
                    borderRadius="md"
                  >
                    Choose Avatar
                  </FormLabel>
                </FormControl>
                <FormControl>
                  <FormLabel htmlFor="firstName">First Name</FormLabel>
                  <Input as={Field} name="firstName" type="text" />
                  <ErrorMessage name="firstName" />
                </FormControl>
                <FormControl>
                  <FormLabel htmlFor="lastName">Last Name</FormLabel>
                  <Input as={Field} name="lastName" type="text" />
                  <ErrorMessage name="lastName" />
                </FormControl>
                <FormControl>
                  <FormLabel htmlFor="description">
                    Share your experience
                  </FormLabel>
                  <Input as={Field} name="description" type="text" />
                  <ErrorMessage name="description" />
                </FormControl>
                <FormControl>
                  <FormLabel htmlFor="jobTitle">Job Title</FormLabel>
                  <Input as={Field} name="jobTitle" type="text" />
                  <ErrorMessage name="jobTitle" />
                </FormControl>
                <Button
                  type="submit"
                  isLoading={isSubmitting}
                  colorScheme="blue"
                  mt={5}
                >
                  Submit
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </Box>
    </Box>
  );
};

export default UserFeedback;
