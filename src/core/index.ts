import { ValidationErrors } from "@/types";

export const initialUser = {
  id: "",
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  dateOfBirth: "",
};
export const initialValidation = {
  addressLine: "",
  postcode: "",
  dateMovedIn: "",
};
export const initialAddress = {
  addressLine: "",
  postcode: "",
  dateMovedIn: null,
  postcodes: [] as string[],
  validationErrors: initialValidation as ValidationErrors,
};
