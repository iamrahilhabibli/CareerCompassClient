import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import { useFormik } from "formik";
import html2pdf from "html2pdf.js";
import resumeImg from "../../images/resumecreate.png";
import {
  Box,
  Center,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  VStack,
  Flex,
  Select,
} from "@chakra-ui/react";

export function ResumeBuild() {
  const [educationLevels, setEducationLevels] = useState([]);
  const resumePreviewRef = useRef(null);

  useEffect(() => {
    axios
      .get("https://localhost:7013/api/EducationLevels/GetAll")
      .then((response) => {
        setEducationLevels(response.data);
      })
      .catch((error) => {
        console.error("Error fetching education levels:", error);
      });
  }, []);

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      experience: "",
      education: "",
      skills: "",
    },
    onSubmit: (values) => {
      // Handle submission
    },
  });

  const downloadPDF = () => {
    const content = resumePreviewRef.current;
    const pdf = html2pdf().from(content).outputPdf();

    pdf.then((pdf) => {
      const link = document.createElement("a");
      link.href = URL.createObjectURL(
        new Blob([pdf], { type: "application/pdf" })
      );
      link.download = "resume.pdf";
      link.click();
    });
  };

  return (
    <>
      <Box
        borderWidth={"1px"}
        rounded={"lg"}
        shadow="1px 1px 3px rgba(0,0,0,0.3)"
        maxWidth={800}
        bg={"white"}
        m="10px auto"
        height={"200px"}
        borderRadius={"12px"}
        bgRepeat="no-repeat"
        bgImage={resumeImg}
        bgSize="auto 100%"
        bgPosition="right"
        position="relative"
      >
        <Flex alignItems={"center"} ml={"50px"} width={"100%"} height={"100%"}>
          <Heading color={"#2D2D2D"} fontSize={"28px"} as="h5" size="md">
            Create your resume
          </Heading>
        </Flex>
      </Box>
      <VStack spacing={4} align="center" w="100%">
        <Flex direction="column" w={["90%", "80%", "70%", "60%"]}>
          <form onSubmit={formik.handleSubmit}>
            <FormControl isRequired mb={"20px"}>
              <FormLabel
                htmlFor="firstName"
                fontWeight="md"
                color="gray.700"
                _dark={{ color: "gray.50" }}
              >
                First Name
              </FormLabel>
              <Input
                id="firstName"
                name="firstName"
                onChange={formik.handleChange}
                value={formik.values.firstName}
              />
            </FormControl>
            {/* ... Repeat for other fields like lastName, email, phoneNumber, etc. ... */}
            <FormControl isRequired mb={"20px"}>
              <FormLabel
                htmlFor="education"
                fontWeight="md"
                color="gray.700"
                _dark={{ color: "gray.50" }}
              >
                Education Level
              </FormLabel>
              <Select
                name="education"
                id="education"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.education}
              >
                <option value="" disabled>
                  Select option
                </option>
                {educationLevels.map((level) => (
                  <option key={level.id} value={level.id}>
                    {level.name}
                  </option>
                ))}
              </Select>
            </FormControl>
            <Button type="submit" colorScheme="blue">
              Create Resume
            </Button>
          </form>
          <Box
            ref={resumePreviewRef}
            w="100%"
            p={4}
            borderWidth={1}
            borderRadius="lg"
          >
            {/* ... Preview content ... */}
          </Box>
          <Button onClick={downloadPDF} colorScheme="teal">
            Download PDF
          </Button>
        </Flex>
      </VStack>
    </>
  );
}
