export interface SignUpFormData extends SignInFormData {
  email: string;
}

export interface SignInFormData {
  username: string;
  password: string;
}
