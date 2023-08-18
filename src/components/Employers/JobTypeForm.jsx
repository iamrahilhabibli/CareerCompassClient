import React, { useEffect, useState } from "react";
import { Box, Button, Flex, FormControl, FormLabel } from "@chakra-ui/react";
import { FiPlus, FiCheck } from "react-icons/fi";

export const JobTypeForm = ({ formik }) => {
  const [jobTypes, setJobTypes] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [selectedSchedules, setSelectedSchedules] = useState([]);
  const [selectedJobTypes, setSelectedJobTypes] = useState([]);

  useEffect(() => {
    const fetchData = async (url, setDataFunction) => {
      try {
        const response = await fetch(url);
        const data = await response.json();
        setDataFunction(data);
      } catch (error) {
        console.error(`Error fetching data from ${url}:`, error);
      }
    };

    fetchData("https://localhost:7013/api/JobTypes", setJobTypes);
    fetchData("https://localhost:7013/api/Schedules/GetAll", setSchedules);
  }, []);

  const handleAddSchedule = (schedule) => {
    if (selectedSchedules.find((s) => s.id === schedule.id)) {
      handleRemoveSchedule(schedule.id);
      return;
    }
    const newSelectedSchedules = [...selectedSchedules, schedule];
    setSelectedSchedules(newSelectedSchedules);
    formik.setFieldValue(
      "scheduleId",
      newSelectedSchedules.map((s) => s.id).join(",")
    );
  };

  const handleRemoveSchedule = (scheduleId) => {
    const newSelectedSchedules = selectedSchedules.filter(
      (s) => s.id !== scheduleId
    );
    setSelectedSchedules(newSelectedSchedules);
    formik.setFieldValue(
      "scheduleId",
      newSelectedSchedules.map((s) => s.id).join(",")
    );
  };

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
      <FormControl isRequired>
        <FormLabel
          fontWeight="md"
          color="gray.700"
          _dark={{ color: "gray.50" }}
        >
          Schedule
        </FormLabel>
        <Flex wrap="wrap">
          {schedules.map((schedule) => (
            <Button
              key={schedule.id}
              borderColor="blue.500"
              borderWidth="1px"
              borderRadius="12px"
              bg={
                selectedSchedules.find((s) => s.id === schedule.id)
                  ? "blue.500"
                  : "white"
              }
              color={
                selectedSchedules.find((s) => s.id === schedule.id)
                  ? "white"
                  : "blue.500"
              }
              m={2}
              _hover={{
                color: "white",
                bg: "blue.500",
              }}
              onClick={() => handleAddSchedule(schedule)}
            >
              {selectedSchedules.find((s) => s.id === schedule.id) ? (
                <FiCheck />
              ) : (
                <FiPlus />
              )}{" "}
              {schedule.shiftName}{" "}
            </Button>
          ))}
        </Flex>
      </FormControl>
    </>
  );
};
