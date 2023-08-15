import {
  FormControl,
  FormLabel,
  GridItem,
  Heading,
  Input,
  Select,
  Text,
} from "@chakra-ui/react";

export const CompanyDetailsForm = ({ formik }) => {
  const COMPANY_SIZES = [
    { value: "1", label: "1-50 employees" },
    { value: "51", label: "51-100 employees" },
    { value: "101", label: "101-250 employees" },
    { value: "251", label: "251-500 employees" },
    { value: "501", label: "501-1000 employees" },
    { value: "1001", label: "1001-2500 employees" },
    { value: "2501", label: "2501-5000 employees" },
    { value: "5001", label: "5001-10000 employees" },
    { value: "10001", label: "10000+ employees" },
  ];

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
          <option>Azerbaijan, Baku</option>
        </Select>
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
        <Text fontSize={"15px"} color={"red"} mb="8px">
          {formik.touched.name && formik.errors.name}
        </Text>
        <Input
          type="text"
          name="street_address"
          id="street_address"
          autoComplete="street-address"
          focusBorderColor="brand.400"
          shadow="sm"
          size="sm"
          w="full"
          rounded="md"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.street_address}
        />
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
        <Input
          type="text"
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
        <Input
          type="text"
          name="industryId"
          id="industryId"
          autoComplete="industry"
          focusBorderColor="brand.400"
          shadow="sm"
          size="sm"
          w="full"
          rounded="md"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.industryId}
        />
      </FormControl>
    </>
  );
};
