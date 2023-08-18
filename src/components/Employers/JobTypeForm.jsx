import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Text,
} from "@chakra-ui/react";
import { FiPlus } from "react-icons/fi";
import { FiMinus } from "react-icons/fi";
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
    if (selectedJobTypes.find((jt) => jt.id === jobType.id)) return;
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
              color="blue.500"
              borderColor="blue.500"
              borderWidth="1px"
              borderRadius="12px"
              bg="white"
              m={2}
              _hover={{
                color: "white",
                bg: "blue.500",
              }}
              onClick={() => handleAddJobType(jobType)}
            >
              {jobType.typeName} <FiPlus />
            </Button>
          ))}
        </Flex>
        <Box borderWidth="1px" rounded="lg" p={3} mt={3}>
          <Text fontWeight="bold">Selected Job Types:</Text>
          <Flex wrap="wrap">
            {selectedJobTypes.map((jobType) => (
              <Flex key={jobType.id} align="center" m={2} width="200px">
                <Button
                  borderColor="blue.500"
                  borderWidth="1px"
                  borderRadius="12px"
                  bg="white"
                  color="blue.500"
                  _hover={{
                    color: "white",
                    bg: "red.500",
                    borderColor: "red.500",
                  }}
                  onClick={() => handleRemoveJobType(jobType.id)}
                >
                  {jobType.typeName}
                </Button>
              </Flex>
            ))}
          </Flex>
        </Box>
      </FormControl>
    </>
  );
};
