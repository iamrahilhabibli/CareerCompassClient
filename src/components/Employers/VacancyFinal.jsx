import React, { useEffect, useState } from "react";
import { Box, Heading, VStack, Text, Button } from "@chakra-ui/react";
import { EditIcon } from "@chakra-ui/icons";

export function VacancyFinal({ formik }) {
  const [experienceLevels, setExperienceLevels] = useState([]);
  const [locations, setLocations] = useState([]);
  const [jobTypes, setJobTypes] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [editing, setEditing] = useState({});

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
      ?.levelName || "N/A";

  const jobLocationName =
    locations.find((loc) => loc.id === formik.values.locationId)?.location ||
    "N/A";

  const jobTypeNames = (
    formik.values.jobTypeIds?.length
      ? formik.values.jobTypeIds.map(
          (id) => jobTypes.find((jt) => jt.id === id)?.typeName || "N/A"
        )
      : []
  ).join(", ");

  const shiftNames = (
    formik.values.shiftIds?.length
      ? formik.values.shiftIds.map(
          (id) => schedules.find((s) => s.id === id)?.shiftName || "N/A"
        )
      : []
  ).join(", ");

  const saveChanges = () => {};
  return (
    <VStack spacing={5} align="stretch">
      <Heading>Review Your Vacancy Details</Heading>
      <Box d="flex" alignItems="center">
        <Text fontWeight="bold">Job Title:</Text>
        {editing.jobTitle ? (
          <input
            type="text"
            value={formik.values.jobTitle}
            onChange={(e) => formik.setFieldValue("jobTitle", e.target.value)}
            onBlur={() => setEditing({ ...editing, jobTitle: false })}
          />
        ) : (
          <>
            <Text>{formik.values.jobTitle}</Text>
            <EditIcon
              onClick={() => setEditing({ ...editing, jobTitle: true })}
              cursor="pointer"
            />
          </>
        )}
      </Box>
      <Box d="flex" alignItems="center">
        <Text fontWeight="bold">Experience Level:</Text>
        <Text>{experienceLevelName}</Text>
        <EditIcon
          onClick={() => setEditing({ ...editing, experienceLevel: true })}
          cursor="pointer"
        />
      </Box>
      <Box d="flex" alignItems="center">
        <Text fontWeight="bold">Location:</Text>
        <Text>{jobLocationName}</Text>
        <EditIcon
          onClick={() => setEditing({ ...editing, location: true })}
          cursor="pointer"
        />
      </Box>
      <Box d="flex" alignItems="center">
        <Text fontWeight="bold">Job Types:</Text>
        <Text>{jobTypeNames}</Text>
        <EditIcon
          onClick={() => setEditing({ ...editing, jobTypes: true })}
          cursor="pointer"
        />
      </Box>
      <Box d="flex" alignItems="center">
        <Text fontWeight="bold">Shifts:</Text>
        <Text>{shiftNames}</Text>
        <EditIcon
          onClick={() => setEditing({ ...editing, shifts: true })}
          cursor="pointer"
        />
      </Box>
      <Box d="flex" alignItems="center">
        <Text fontWeight="bold">Job Description:</Text>
        <div dangerouslySetInnerHTML={{ __html: formik.values.description }} />
        <EditIcon
          onClick={() => setEditing({ ...editing, description: true })}
          cursor="pointer"
        />
      </Box>
      <Button colorScheme="blue" onClick={saveChanges}>
        Save Changes
      </Button>
    </VStack>
  );
}
