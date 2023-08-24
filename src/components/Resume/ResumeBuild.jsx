import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import { Spinner, useToast } from "@chakra-ui/react";
import { useFormik } from "formik";
import html2pdf from "html2pdf.js";
import resumeImg from "../../images/resumecreate.png";
import { FiCheck, FiChevronDown, FiChevronUp, FiPlus } from "react-icons/fi";
import { fetchJobSeekerDetails } from "../../services/fetchJobSeekerDetails";
import { Editor } from "@tinymce/tinymce-react";
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
import { useMutation } from "react-query";

export function ResumeBuild() {
  const [educationLevels, setEducationLevels] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [displaySkillsLimit, setDisplaySkillsLimit] = useState(4);
  const [displayMoreSkills, setDisplayMoreSkills] = useState(false);
  const [isResumeCreated, setIsResumeCreated] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedSkillsValue, setSelectedSkillsValue] = useState(0);
  const toast = useToast();
  const resumePreviewRef = useRef(null);
  const { userId, token } = useUser();
  const YearsOfExperienceOptions = [
    { label: "Less Than 1", value: 0 },
    { label: "1 to 3", value: 1 },
    { label: "4 to 6", value: 2 },
    { label: "7 to 9", value: 3 },
    { label: "10 to 12", value: 4 },
    { label: "13 to 15", value: 5 },
    { label: "16 to 18", value: 6 },
    { label: "19 to 20", value: 7 },
    { label: "20 Plus", value: 8 },
  ];
  const Skills = [
    { name: "Communication", value: 1 << 0 },
    { name: "Leadership", value: 1 << 1 },
    { name: "Problem Solving", value: 1 << 2 },
    { name: "Teamwork", value: 1 << 3 },
    { name: "Creativity", value: 1 << 4 },
    { name: "Technical Literacy", value: 1 << 5 },
    { name: "Project Management", value: 1 << 6 },
    { name: "Time Management", value: 1 << 7 },
    { name: "Analytical Thinking", value: 1 << 8 },
    { name: "Attention To Detail", value: 1 << 9 },
  ];

  const remainingSkills = Skills.length - displaySkillsLimit;

  const handleAddSkill = (skillName) => {
    const skill = Skills.find((s) => s.name === skillName);
    const updatedSkillsValue = selectedSkillsValue ^ skill.value;
    setSelectedSkillsValue(updatedSkillsValue);
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
    </Box>
  );

  const mutation = useMutation(
    (values) => {
      const dataToSend = {
        experience: values.experience,
        educationLevelId: values.education,
        skills: values.skills,
        description: values.description,
        phoneNumber: values.phoneNumber,
      };
      return axios.post(
        `https://localhost:7013/api/JobSeekers/Post?userId=${userId}`,
        dataToSend,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
    },
    {
      onSuccess: () => {
        setShowPreview(true);
        setIsResumeCreated(true);
        toast({
          title: "Success",
          description:
            "Resume created successfully! You can now click to pay and download.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      },
    }
  );

  const formik = useFormik({
    initialValues: {
      experience: 0,
      education: "",
      description: "",
      phoneNumber: "",
    },
    onSubmit: (values) => {
      console.log(values);
      const experience = parseInt(values.experience, 10);
      const dataToSend = {
        experience,
        education: values.education,
        description: values.description,
        phoneNumber: values.phoneNumber,
      };

      mutation.mutate(dataToSend, {
        onSuccess: () => {
          setShowPreview(true);
          setIsResumeCreated(true);
        },
        onError: (error) => {
          console.error("Error submitting data:", error);
        },
      });
    },
  });
  useEffect(() => {
    fetchJobSeekerDetails(userId, token).then((details) => {
      if (details) {
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
                // isReadOnly
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
                {YearsOfExperienceOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </FormControl>

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

            {/* <Flex wrap="wrap">
              {Skills.slice(
                0,
                displayMoreSkills ? Skills.length : displaySkillsLimit
              ).map((skill) => (
                <Button
                  key={skill.name}
                  onClick={() => handleAddSkill(skill.name)}
                  borderColor="blue.500"
                  borderWidth="1px"
                  borderRadius="12px"
                  bg={selectedSkillsValue & skill.value ? "blue.500" : "white"}
                  color={
                    selectedSkillsValue & skill.value ? "white" : "blue.500"
                  }
                  m={2}
                  _hover={{
                    color: "white",
                    bg: "blue.500",
                  }}
                >
                  {selectedSkillsValue & skill.value ? <FiCheck /> : <FiPlus />}{" "}
                  {skill.name}
                </Button>
              ))}
              {remainingSkills > 0 && (
                <Flex
                  color={"blue.700"}
                  fontWeight={700}
                  onClick={() => setDisplayMoreSkills(!displayMoreSkills)}
                  m={2}
                  alignItems="center"
                >
                  <Text as="span" mr={1}>
                    {displayMoreSkills ? "Show less" : "Show more"}
                  </Text>
                  <Text as="span" mr={2}>
                    ({remainingSkills})
                  </Text>
                  {displayMoreSkills ? (
                    <FiChevronUp size={24} />
                  ) : (
                    <FiChevronDown size={24} />
                  )}
                </Flex>
              )}
            </Flex> */}

            <Editor
              apiKey="ampk5o36dpm7qqhr2h54evb0g8b4fqptomyoa5ntgpubk2h4"
              value={formik.values.description}
              id="description"
              init={{
                height: 300,
                menubar: false,
                plugins:
                  "advlist autolink lists link image charmap print preview anchor searchreplace visualblocks code fullscreen insertdatetime media table paste code help wordcount",
                toolbar:
                  "undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help",
              }}
              onEditorChange={(content) =>
                formik.setFieldValue("description", content)
              }
            />
            <Button
              type="submit"
              colorScheme="blue"
              isLoading={mutation.isLoading}
              leftIcon={mutation.isLoading ? <Spinner /> : null}
            >
              Create Resume
            </Button>
          </form>
          {showPreview && (
            <>
              <Box
                ref={resumePreviewRef}
                w="100%"
                p={4}
                borderWidth={1}
                borderRadius="lg"
              >
                {renderPreview(formik.values)}
              </Box>
              <Button
                onClick={downloadPDF}
                colorScheme="teal"
                isDisabled={!isResumeCreated}
              >
                Download PDF
              </Button>
            </>
          )}
        </Flex>
      </VStack>
    </>
  );
}
