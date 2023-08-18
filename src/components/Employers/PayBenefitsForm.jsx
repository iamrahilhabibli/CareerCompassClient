import {
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Select,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

export function PayBenefitsForm({ formik }) {
  const [experienceLevels, setExperienceLevels] = useState([]);

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
  }, []);
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
      <FormControl isRequired>
        <FormLabel
          htmlFor="experienceLevelId"
          fontWeight="md"
          color="gray.700"
          _dark={{ color: "gray.50" }}
        >
          Experience Level
        </FormLabel>
        <Select
          id="experienceLevelId"
          placeholder="Select Experience Level"
          onChange={(e) =>
            formik.setFieldValue("experienceLevelId", e.target.value)
          }
          onBlur={formik.handleBlur}
          value={formik.values.experienceLevelId}
        >
          {experienceLevels.map((level) => (
            <option key={level.id} value={level.id}>
              {level.levelName}
            </option>
          ))}
        </Select>
      </FormControl>
    </>
  );
}
