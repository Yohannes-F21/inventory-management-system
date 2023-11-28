import { Loan } from "./Loan";

export type Employee = {
  key: string;
  firstName: string;
  middleName: string;
  lastName: string;
  nationality: string;
  dateOfBirth: string;
  age?: string;
  gender: string;
  phoneNo: string;
  id: string;
  email: string;
  country: string;
  city: string;
  subcity: string;
  woreda: number;
  houseNo: number;
  registerDate: string;
  orderdItems: Loan[];
  department: string;
};
export type Employment = {
  employeeId: string;
  department: string;
  registerDate: string;
  hireStatus: string;
};
