import * as Yup from "yup";

export const registrationValidationSchema = Yup.object({
  firstName: Yup.string().required("Required"),
  lastName: Yup.string(),
  email: Yup.string().email("Invalid email address").required("Required"),
  password: Yup.string()
    .min(8, "Must be 8 characters or more")
    .required("Required"),
  role: Yup.number().required("Required"),
});
