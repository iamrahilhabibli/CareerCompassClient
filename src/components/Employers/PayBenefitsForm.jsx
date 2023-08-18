import {
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";

export function PayBenefitsForm({ formik }) {
  return (
    <>
      <FormControl isRequired>
        <FormLabel
          htmlFor="salary"
          fontWeight="md"
          color="gray.700"
          _dark={{ color: "gray.50" }}
        >
          Salary
        </FormLabel>
        <NumberInput
          id="salary"
          step={1}
          precision={2}
          onChange={(value) => formik.setFieldValue("salary", value)}
          onBlur={formik.handleBlur}
          value={formik.values.salary}
        >
          <NumberInputField placeholder="Enter amount" />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </FormControl>
    </>
  );
}
