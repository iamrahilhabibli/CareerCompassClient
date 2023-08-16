import {
  FormControl,
  FormLabel,
  GridItem,
  Heading,
  Input,
  Select,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

export const CompanyDetailsForm = ({ formik }) => {
  const [locations, setLocations] = useState([]);
  const [industries, setIndustries] = useState([]);
  const COMPANY_SIZES = [
    { value: "1", label: "1-50 employees" },
    { value: "2", label: "51-100 employees" },
    { value: "3", label: "101-250 employees" },
    { value: "4", label: "251-500 employees" },
    { value: "5", label: "501-1000 employees" },
    { value: "6", label: "1001-2500 employees" },
    { value: "7", label: "2501-5000 employees" },
    { value: "8", label: "5001-10000 employees" },
    { value: "9", label: "10000+ employees" },
  ];

  useEffect(() => {
    const fetchData = async (url, setDataFunction) => {
      try {
        const response = await fetch(url);
        const data = await response.json();
        console.log(data);
        setDataFunction(data);
      } catch (error) {
        console.error(`Error fetching data from ${url}:`, error);
      }
    };

    fetchData("https://localhost:7013/api/Locations/GetAll", setLocations);
    fetchData("https://localhost:7013/api/Industries/GetAll", setIndustries);
  }, []);

  return (
    <>
      <Heading w="100%" textAlign={"center"} fontWeight="normal" mb="2%">
        Company Details
      </Heading>

      <FormControl as={GridItem} colSpan={[6, 3]} isRequired>
        <FormLabel
          htmlFor="country"
          fontSize="sm"
          fontWeight="md"
          color="gray.700"
          _dark={{ color: "gray.50" }}
        >
          Country / Region
        </FormLabel>
        <Select
          id="country"
          name="country"
          autoComplete="country"
          placeholder="Select option"
          focusBorderColor="brand.400"
          shadow="sm"
          size="sm"
          w="full"
          rounded="md"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.country}
        >
          {locations.map((loc) => (
            <option key={loc.id} value={loc.id}>
              {loc.location}
            </option>
          ))}
        </Select>
      </FormControl>

      <FormControl as={GridItem} colSpan={[6, 6, null, 2]} isRequired>
        <FormLabel
          htmlFor="ceoName"
          fontSize="sm"
          fontWeight="md"
          color="gray.700"
          _dark={{ color: "gray.50" }}
          mt="2%"
        >
          CEO Name
        </FormLabel>
        <Text fontSize={"15px"} color={"red"} mb="8px">
          {formik.touched.ceoName && formik.errors.ceoName}
        </Text>
        <Input
          type="text"
          name="ceoName"
          id="ceoName"
          autoComplete="name"
          focusBorderColor="brand.400"
          shadow="sm"
          size="sm"
          w="full"
          rounded="md"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.ceoName}
        />
      </FormControl>

      <FormControl as={GridItem} colSpan={[6, 3, null, 2]} isRequired>
        <FormLabel
          htmlFor="dateFounded"
          fontSize="sm"
          fontWeight="md"
          color="gray.700"
          _dark={{ color: "gray.50" }}
          mt="2%"
        >
          Date Founded
        </FormLabel>
        <Text fontSize={"15px"} color={"red"} mb="8px">
          {formik.touched.dateFounded && formik.errors.dateFounded}
        </Text>
        <Input
          type="number"
          name="dateFounded"
          id="dateFounded"
          autoComplete="date"
          focusBorderColor="brand.400"
          shadow="sm"
          size="sm"
          w="full"
          rounded="md"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.dateFounded}
        />
      </FormControl>

      <FormControl as={GridItem} colSpan={6} isRequired>
        <FormLabel
          htmlFor="street_address"
          fontSize="sm"
          fontWeight="md"
          color="gray.700"
          _dark={{ color: "gray.50" }}
          mt="2%"
        >
          Street address
        </FormLabel>
        <Input
          type="text"
          name="address"
          id="address"
          autoComplete="address"
          focusBorderColor="brand.400"
          shadow="sm"
          size="sm"
          w="full"
          rounded="md"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.address}
        />
      </FormControl>

      <FormControl as={GridItem} colSpan={[6, 3, null, 2]} isRequired>
        <FormLabel
          htmlFor="companySize"
          fontSize="sm"
          fontWeight="md"
          color="gray.700"
          _dark={{ color: "gray.50" }}
          mt="2%"
        >
          Company Size
        </FormLabel>
        <Select
          name="companySize"
          id="companySize"
          autoComplete="number"
          focusBorderColor="brand.400"
          shadow="sm"
          size="sm"
          w="full"
          rounded="md"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.companySize}
        >
          {COMPANY_SIZES.map((size) => (
            <option key={size.value} value={size.value}>
              {size.label}
            </option>
          ))}
        </Select>
      </FormControl>
      <FormControl as={GridItem} colSpan={[6, 3, null, 2]} isRequired>
        <FormLabel
          htmlFor="industryId"
          fontSize="sm"
          fontWeight="md"
          color="gray.700"
          _dark={{ color: "gray.50" }}
          mt="2%"
        >
          Choose your Industry
        </FormLabel>
        <Select
          id="industryId"
          name="industryId"
          autoComplete="industryId"
          placeholder="Select option"
          focusBorderColor="brand.400"
          shadow="sm"
          size="sm"
          w="full"
          rounded="md"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.industryId}
        >
          {industries.map((ind) => (
            <option key={ind.id} value={ind.id}>
              {ind.name}
            </option>
          ))}
        </Select>
      </FormControl>
    </>
  );
};
