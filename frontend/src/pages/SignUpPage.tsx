import { Box } from "@mui/material";
import { SignUpForm } from "../components/SignUpForm";
import { useState } from "react";
import { SignUpFormData } from "../types/User";
import { useNavigate } from "react-router";
import { signUpApi } from "../api/auth";

export function SignUpPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string>();
  const navigate = useNavigate();

  const handleSubmit = async (data: SignUpFormData) => {
    try {
      setIsLoading(true);
      setApiError(undefined);

      await signUpApi(data);

      navigate("/signin");
    } catch (error: any) {
      setApiError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      width="100%"
    >
      <SignUpForm
        onSubmit={handleSubmit}
        isLoading={isLoading}
        apiError={apiError}
      />
    </Box>
  );
}
