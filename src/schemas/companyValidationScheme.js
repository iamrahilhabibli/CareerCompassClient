import * as yup from "yup";

export const companyValidationScheme = yup.object().shape({
  name: yup
    .string()
    .required("Company name is required")
    .max(50, "Company name should be max 50 characters")
    .matches(
      /^[a-zA-Z0-9]+$/,
      "Company name can only contain letters and digits"
    ),

  ceoName: yup
    .string()
    .required("CEO name is required")
    .max(50, "CEO name should be max 50 characters")
    .matches(/^[a-zA-Z ]+$/, "CEO name can only contain letters"),

  dateFounded: yup
    .number()
    .required("Date founded is required")
    .max(
      new Date().getFullYear(),
      "Date founded cannot be after the current year"
    ),
});
