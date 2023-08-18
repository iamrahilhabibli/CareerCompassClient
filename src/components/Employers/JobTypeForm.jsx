import React, { useEffect, useState } from "react";
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Text,
  Box,
} from "@chakra-ui/react";
import { FiPlus, FiCheck } from "react-icons/fi";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
export const JobTypeForm = ({ formik }) => {
  const [jobTypes, setJobTypes] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [displayLimit, setDisplayLimit] = useState(4);
  const [selectedSchedules, setSelectedSchedules] = useState([]);
  const [selectedJobTypes, setSelectedJobTypes] = useState([]);
  const [displayMore, setDisplayMore] = useState(false);
  const remainingSchedules = schedules.length - displayLimit;
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
      "shiftIds",
      newSelectedSchedules.map((s) => s.id)
    );
  };

  const handleRemoveSchedule = (scheduleId) => {
    const newSelectedSchedules = selectedSchedules.filter(
      (s) => s.id !== scheduleId
    );
    setSelectedSchedules(newSelectedSchedules);
    formik.setFieldValue(
      "shiftIds",
      newSelectedSchedules.map((s) => s.id)
    );
  };

  const handleToggleDisplayMore = () => {
    setDisplayMore(!displayMore);
  };
  const handleAddJobType = (jobType) => {
    if (selectedJobTypes.find((jt) => jt.id === jobType.id)) {
      handleRemoveJobType(jobType.id);
      return;
    }
    const newSelectedJobTypes = [...selectedJobTypes, jobType];
    setSelectedJobTypes(newSelectedJobTypes);
    formik.setFieldValue(
      "jobTypeIds",
      newSelectedJobTypes.map((jt) => jt.id)
    );
  };

  const handleRemoveJobType = (jobTypeId) => {
    const newSelectedJobTypes = selectedJobTypes.filter(
      (jt) => jt.id !== jobTypeId
    );
    setSelectedJobTypes(newSelectedJobTypes);
    formik.setFieldValue(
      "jobTypeIds",
      newSelectedJobTypes.map((jt) => jt.id)
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
          {schedules
            .slice(0, displayMore ? schedules.length : displayLimit)
            .map((schedule) => (
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
                {schedule.shiftName}
              </Button>
            ))}
          {remainingSchedules > 0 && (
            <Flex
              color={"blue.700"}
              fontWeight={700}
              onClick={handleToggleDisplayMore}
              m={2}
              alignItems="center"
            >
              <Text as="span" mr={1}>
                {" "}
                {displayMore ? "Show less" : "Show more"}
              </Text>
              <Text as="span" mr={2}>
                {" "}
                ({remainingSchedules})
              </Text>
              {displayMore ? (
                <FiChevronUp size={24} />
              ) : (
                <FiChevronDown size={24} />
              )}{" "}
            </Flex>
          )}
        </Flex>
      </FormControl>
    </>
  );
};
