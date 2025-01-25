export interface SignUpFormData extends SignInFormData {
  email: string;
  native_language: string;
}

export interface SignInFormData {
  username: string;
  password: string;
}
