import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import { useFormik } from "formik";
import html2pdf from "html2pdf.js";
import resumeImg from "../../images/resumecreate.png";
import { FiCheck, FiPlus } from "react-icons/fi";
import { fetchJobSeekerDetails } from "../../services/fetchJobSeekerDetails";
import {
  Box,
  Center,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Text,
  Button,
  VStack,
  Flex,
  Select,
} from "@chakra-ui/react";
import useUser from "../../customhooks/useUser";

export function ResumeBuild() {
  const [educationLevels, setEducationLevels] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const resumePreviewRef = useRef(null);
  const { userId, token } = useUser();
  const YearsOfExperienceLabels = [
    "Less Than 1",
    "1 to 3",
    "4 to 6",
    "7 to 9",
    "10 to 12",
    "13 to 15",
    "16 to 18",
    "19 to 20",
    "20 Plus",
  ];
  const Skills = [
    "Communication",
    "Leadership",
    "ProblemSolving",
    "Teamwork",
    "Creativity",
    "TechnicalLiteracy",
    "ProjectManagement",
    "TimeManagement",
    "AnalyticalThinking",
    "AttentionToDetail",
  ];

  const handleAddSkill = (skill) => {
    let newSelectedSkills;
    if (selectedSkills.includes(skill)) {
      newSelectedSkills = selectedSkills.filter((s) => s !== skill);
    } else {
      newSelectedSkills = [...selectedSkills, skill];
    }
    setSelectedSkills(newSelectedSkills);
    formik.setFieldValue("skills", newSelectedSkills.join(", "));
  };

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

  const renderPreview = (values) => (
    <Box>
      <Heading>
        {values.firstName} {values.lastName}
      </Heading>
      <Text>Email: {values.email}</Text>
      <Text>Phone: {values.phoneNumber}</Text>
      <Text>Experience: {values.experience}</Text>
      <Text>
        Education:{" "}
        {educationLevels.find((level) => level.id === values.education)?.name}
      </Text>
      <Text>Skills: {values.skills}</Text>
    </Box>
  );

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
  useEffect(() => {
    fetchJobSeekerDetails(userId, token).then((details) => {
      if (details) {
        console.log(details);
        formik.setFieldValue("firstName", details.firstName);
        formik.setFieldValue("lastName", details.lastName);
        formik.setFieldValue("email", details.email);
        formik.setFieldValue("phoneNumber", details.phoneNumber);
      }
    });
  }, [userId, token]);
  const downloadPDF = () => {
    const content = resumePreviewRef.current;
    const opt = {
      margin: 10,
      filename: "resume.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };
    html2pdf().set(opt).from(content).save();
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
            <FormControl mb={"20px"}>
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
                isReadOnly
                bg="gray.100"
              />
            </FormControl>

            <FormControl mb={"20px"}>
              <FormLabel
                htmlFor="lastName"
                fontWeight="md"
                color="gray.700"
                _dark={{ color: "gray.50" }}
              >
                Last Name
              </FormLabel>
              <Input
                id="lastName"
                name="lastName"
                onChange={formik.handleChange}
                value={formik.values.lastName}
                isReadOnly
                bg="gray.100"
              />
            </FormControl>

            <FormControl mb={"20px"}>
              <FormLabel
                htmlFor="email"
                fontWeight="md"
                color="gray.700"
                _dark={{ color: "gray.50" }}
              >
                Email
              </FormLabel>
              <Input
                id="email"
                name="email"
                onChange={formik.handleChange}
                value={formik.values.email}
                isReadOnly
                bg="gray.100"
              />
            </FormControl>

            <FormControl mb={"20px"}>
              <FormLabel
                htmlFor="phoneNumber"
                fontWeight="md"
                color="gray.700"
                _dark={{ color: "gray.50" }}
              >
                Phone number
              </FormLabel>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                onChange={formik.handleChange}
                value={formik.values.phoneNumber}
                isReadOnly
                bg="gray.100"
              />
            </FormControl>

            <FormControl isRequired mb={"20px"}>
              <FormLabel
                htmlFor="experience"
                fontWeight="md"
                color="gray.700"
                _dark={{ color: "gray.50" }}
              >
                Years of Experience
              </FormLabel>
              <Select
                name="experience"
                id="experience"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.experience}
              >
                <option value="" disabled>
                  Select option
                </option>
                {YearsOfExperienceLabels.map((label, index) => (
                  <option key={index} value={label}>
                    {label}
                  </option>
                ))}
              </Select>
            </FormControl>

            {/* Include other form controls like firstName, lastName, email, phoneNumber, etc. */}
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

            <Flex wrap="wrap">
              {Skills.map((skill) => (
                <Button
                  key={skill}
                  borderColor="blue.500"
                  borderWidth="1px"
                  borderRadius="12px"
                  bg={selectedSkills.includes(skill) ? "blue.500" : "white"}
                  color={selectedSkills.includes(skill) ? "white" : "blue.500"}
                  m={2}
                  _hover={{
                    color: "white",
                    bg: "blue.500",
                  }}
                  onClick={() => handleAddSkill(skill)}
                >
                  {selectedSkills.includes(skill) ? <FiCheck /> : <FiPlus />}{" "}
                  {skill}
                </Button>
              ))}
            </Flex>
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
            {renderPreview(formik.values)}
          </Box>
          <Button onClick={downloadPDF} colorScheme="teal">
            Download PDF
          </Button>
        </Flex>
      </VStack>
    </>
  );
}
