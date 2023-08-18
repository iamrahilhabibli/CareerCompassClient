import React, { useEffect, useState } from "react";
import { Box, Button, Flex, FormControl, FormLabel } from "@chakra-ui/react";
import { FiPlus, FiCheck } from "react-icons/fi";

export const JobTypeForm = ({ formik }) => {
  const [jobTypes, setJobTypes] = useState([]);
  const [selectedJobTypes, setSelectedJobTypes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://localhost:7013/api/JobTypes");
        const data = await response.json();
        setJobTypes(data);
      } catch (error) {
        console.error(`Error fetching data from API:`, error);
      }
    };

    fetchData();
  }, []);

  const handleAddJobType = (jobType) => {
    if (selectedJobTypes.find((jt) => jt.id === jobType.id)) {
      handleRemoveJobType(jobType.id);
      return;
    }
    const newSelectedJobTypes = [...selectedJobTypes, jobType];
    setSelectedJobTypes(newSelectedJobTypes);
    formik.setFieldValue(
      "jobTypeId",
      newSelectedJobTypes.map((jt) => jt.id).join(",")
    );
  };

  const handleRemoveJobType = (jobTypeId) => {
    const newSelectedJobTypes = selectedJobTypes.filter(
      (jt) => jt.id !== jobTypeId
    );
    setSelectedJobTypes(newSelectedJobTypes);
    formik.setFieldValue(
      "jobTypeId",
      newSelectedJobTypes.map((jt) => jt.id).join(",")
    );
  };

  return (
    <>
      <FormControl isRequired>
        <FormLabel
          fontWeight="md"
          color="gray.700"
          _dark={{ color: "gray.50" }}
        >
          Job Types
        </FormLabel>
        <Flex wrap="wrap">
          {jobTypes.map((jobType) => (
            <Button
              key={jobType.id}
              borderColor="blue.500"
              borderWidth="1px"
              borderRadius="12px"
              bg={
                selectedJobTypes.find((jt) => jt.id === jobType.id)
                  ? "blue.500"
                  : "white"
              }
              color={
                selectedJobTypes.find((jt) => jt.id === jobType.id)
                  ? "white"
                  : "blue.500"
              }
              m={2}
              _hover={{
                color: "white",
                bg: "blue.500",
              }}
              onClick={() => handleAddJobType(jobType)}
            >
              {selectedJobTypes.find((jt) => jt.id === jobType.id) ? (
                <FiCheck />
              ) : (
                <FiPlus />
              )}{" "}
              {jobType.typeName}
            </Button>
          ))}
        </Flex>
      </FormControl>
    </>
  );
};
