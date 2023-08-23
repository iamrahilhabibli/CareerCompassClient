import React, { useState, useRef } from "react";
import html2pdf from "html2pdf.js";
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
} from "@chakra-ui/react";

export function ResumeBuild() {
  const [resume, setResume] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    summary: "",
    experience: "",
    education: "",
    skills: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setResume({ ...resume, [name]: value });
  };

  const resumePreviewRef = useRef(null);

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
    <VStack spacing={4} align="center">
      <Box bg="lightblue" w="100%" p={4}>
        <Center>
          <Heading>Create your Resume</Heading>
        </Center>
      </Box>
      <Box as="form" w="80%" onSubmit={(e) => e.preventDefault()}>
        <FormControl>
          <FormLabel>Full Name:</FormLabel>
          <Input
            name="fullName"
            value={resume.fullName}
            onChange={handleChange}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Email:</FormLabel>
          <Input name="email" value={resume.email} onChange={handleChange} />
        </FormControl>
        <FormControl>
          <FormLabel>Phone Number:</FormLabel>
          <Input
            name="phoneNumber"
            value={resume.phoneNumber}
            onChange={handleChange}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Summary:</FormLabel>
          <Textarea
            name="summary"
            value={resume.summary}
            onChange={handleChange}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Experience:</FormLabel>
          <Textarea
            name="experience"
            value={resume.experience}
            onChange={handleChange}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Education:</FormLabel>
          <Textarea
            name="education"
            value={resume.education}
            onChange={handleChange}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Skills:</FormLabel>
          <Input name="skills" value={resume.skills} onChange={handleChange} />
        </FormControl>
        <Button type="submit" colorScheme="blue">
          Create Resume
        </Button>
      </Box>
      <Box
        ref={resumePreviewRef}
        w="80%"
        p={4}
        borderWidth={1}
        borderRadius="lg"
      >
        {/* ... Preview content ... */}
      </Box>
      <Button onClick={downloadPDF} colorScheme="teal">
        Download PDF
      </Button>
    </VStack>
  );
}
