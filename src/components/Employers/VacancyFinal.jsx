import React, { useEffect, useState } from "react";
import { Box, Heading, VStack, Text } from "@chakra-ui/react";

export function VacancyFinal({ formik }) {
  const [experienceLevels, setExperienceLevels] = useState([]);
  const [locations, setLocations] = useState([]);
  const [jobTypes, setJobTypes] = useState([]);
  const [schedules, setSchedules] = useState([]);

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

    fetchData(
      "https://localhost:7013/api/ExperienceLevels/GetAll",
      setExperienceLevels
    );
    fetchData("https://localhost:7013/api/Locations/GetAll", setLocations);
    fetchData("https://localhost:7013/api/JobTypes", setJobTypes);
    fetchData("https://localhost:7013/api/Schedules/GetAll", setSchedules);
  }, []);

  const experienceLevelName =
    experienceLevels.find((el) => el.id === formik.values.experienceLevelId)
      ?.name || "N/A";
  const jobLocationName =
    locations.find((loc) => loc.id === formik.values.jobLocationId)?.name ||
    "N/A";
  const jobTypeNames = (
    formik.values.jobTypeIds?.length
      ? formik.values.jobTypeIds.map(
          (id) => jobTypes.find((jt) => jt.id === id)?.name || "N/A"
        )
      : []
  ).join(", ");

  const shiftNames = (
    formik.values.shiftIds?.length
      ? formik.values.shiftIds.map(
          (id) => schedules.find((s) => s.id === id)?.name || "N/A"
        )
      : []
  ).join(", ");

  return (
    <VStack spacing={5} align="stretch">
      <Heading>Review Your Vacancy Details</Heading>
      <Box>
        <Text fontWeight="bold">Job Title:</Text>
        <Text>{formik.values.jobTitle}</Text>
      </Box>
      <Box>
        <Text fontWeight="bold">Experience Level:</Text>
        <Text>{experienceLevelName}</Text>
      </Box>
      <Box>
        <Text fontWeight="bold">Location:</Text>
        <Text>{jobLocationName}</Text>
      </Box>
      <Box>
        <Text fontWeight="bold">Job Types:</Text>
        <Text>{jobTypeNames}</Text>
      </Box>
      <Box>
        <Text fontWeight="bold">Shifts:</Text>
        <Text>{shiftNames}</Text>
      </Box>
    </VStack>
  );
}
