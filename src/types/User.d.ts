export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  dateOfBirth?: string;
}

interface ValidationErrors {
  addressLine: string;
  postcode: string;
  dateMovedIn: string;
}

interface Address {
  addressLine: string;
  postcode: string;
  dateMovedIn: Date | null;
  postcodes: string[];
  validationErrors: ValidationErrors;
}
