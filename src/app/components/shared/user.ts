export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  default_currency: string;
}

export interface RegisterUser {
  id: number;
  name: string;
  email: string;
  password: string;
  password_confirmation: String;
  default_currency: string;
}
