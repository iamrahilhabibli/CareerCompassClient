import React from "react";
import { Box, Heading, Text, Button, VStack, Divider } from "@chakra-ui/react";

export function VacancyFinal({ formik }) {
  return (
    <VStack spacing={5} align="stretch">
      <Heading>Review Your Vacancy Details</Heading>

      <Box>
        <Text fontWeight="bold">Job Title:</Text>
        <Text>{formik.values.jobTitle}</Text>
      </Box>

      <Box>
        <Text fontWeight="bold">Job Description:</Text>
        <div
          dangerouslySetInnerHTML={{ __html: formik.values.jobDescription }}
        />
      </Box>

      <Box>
        <Text fontWeight="bold">Salary:</Text>
        <Text>{formik.values.salary}</Text>
      </Box>

      <Box>
        <Text fontWeight="bold">Experience Level:</Text>
        <Text>{formik.values.experienceLevel}</Text>
      </Box>

      <Box>
        <Text fontWeight="bold">Location:</Text>
        <Text>{formik.values.location}</Text>
      </Box>

      <Box>
        <Text fontWeight="bold">Application Deadline:</Text>
        <Text>{formik.values.deadline}</Text>
      </Box>

      {/* Include other fields here as needed */}

      <Divider />

      <Button colorScheme="blue">Submit</Button>
    </VStack>
  );
}
