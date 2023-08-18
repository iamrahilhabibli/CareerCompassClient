import { Flex, FormControl, FormLabel, Heading, Input } from "@chakra-ui/react";
import React from "react";

export const JobTitleForm = ({ formik }) => {
  return (
    <>
      <Heading w="100%" textAlign={"center"} fontWeight="normal" mb="2%">
        Job Vacancy
      </Heading>
      <Flex p={4}>
        <FormControl isRequired>
          <FormLabel htmlFor="jobTitle">Job Title</FormLabel>
          <Input
            id="jobTitle"
            name="jobTitle"
            onChange={formik.handleChange}
            value={formik.values.jobTitle}
          />
        </FormControl>
      </Flex>
    </>
  );
};
