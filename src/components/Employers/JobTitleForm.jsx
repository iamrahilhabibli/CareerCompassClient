import {
  Flex,
  FormControl,
  FormLabel,
  GridItem,
  Heading,
  Input,
  Select,
  Text,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

export const JobTitleForm = ({ formik }) => {
  const [locations, setLocations] = useState([]);
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

    fetchData("https://localhost:7013/api/Locations/GetAll", setLocations);
  }, []);
  return (
    <>
      <FormControl isRequired>
        <FormLabel
          htmlFor="jobTitle"
          fontWeight="md"
          color="gray.700"
          _dark={{ color: "gray.50" }}
        >
          Job Title
        </FormLabel>
        <Text fontSize={"15px"} color={"red"} mb="8px">
          {formik.touched.jobTitle && formik.errors.jobTitle}
        </Text>
        <Input
          mb={"20px"}
          id="jobTitle"
          name="jobTitle"
          onChange={formik.handleChange}
          value={formik.values.jobTitle}
        />
      </FormControl>
      <FormControl as={GridItem} colSpan={[6, 3]} isRequired>
        <FormLabel
          htmlFor="country"
          fontWeight="md"
          color="gray.700"
          _dark={{ color: "gray.50" }}
        >
          Choose your Job location
        </FormLabel>
        <Text fontSize={"15px"} color={"red"} mb="8px">
          {formik.touched.locationId && formik.errors.locationId}
        </Text>
        <Select
          id="locationId"
          name="locationId"
          autoComplete="locationId"
          placeholder="Select option"
          focusBorderColor="brand.400"
          shadow="sm"
          size="sm"
          w="full"
          rounded="md"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.locationId}
        >
          {locations.map((loc) => (
            <option key={loc.id} value={loc.id}>
              {loc.location}
            </option>
          ))}
        </Select>
      </FormControl>
    </>
  );
};
