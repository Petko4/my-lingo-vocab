import { Box } from "@mui/material";
import { SignInForm } from "../components/SignInForm";
import { useContext, useState } from "react";
import { SignInFormData } from "../types/User";
import { AuthContext } from "../contexts/AuthContext";

export function SignInPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(undefined);

  const { signIn } = useContext(AuthContext);

  const handleSubmit = async (data: SignInFormData) => {
    console.log("SignInPage handleSubmit");
    try {
      setIsLoading(true);
      setApiError(undefined);
      await signIn(data);
    } catch (error: any) {
      setApiError(error.message);
      console.log("In SignInPage Error");
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
      <SignInForm
        onSubmit={handleSubmit}
        isLoading={isLoading}
        apiError={apiError}
      />
    </Box>
  );
}
