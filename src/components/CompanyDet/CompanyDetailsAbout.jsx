import {
  FormControl,
  FormLabel,
  Heading,
  Input,
  Textarea,
  Text,
} from "@chakra-ui/react";

export const CompanyDetailsAbout = ({ formik }) => {
  return (
    <>
      <Heading w="100%" textAlign={"center"} fontWeight="normal">
        Company Details
      </Heading>

      <FormControl mt={4}>
        <FormLabel htmlFor="websiteLink">Website Link</FormLabel>
        <Input
          placeholder="www.yourcompany.com"
          focusBorderColor="brand.400"
          rounded="md"
          name="websiteLink"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.websiteLink}
        />
      </FormControl>

      <FormControl mt={4} isRequired>
        <FormLabel htmlFor="description">Company Description</FormLabel>
        <Text fontSize={"15px"} color={"red"} mb="8px">
          {formik.touched.description && formik.errors.description}
        </Text>
        <Textarea
          placeholder="Enter a brief overview of your company..."
          rows={3}
          shadow="sm"
          focusBorderColor="brand.400"
          fontSize={{
            sm: "sm",
          }}
          name="description"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.description}
        />
      </FormControl>
    </>
  );
};
