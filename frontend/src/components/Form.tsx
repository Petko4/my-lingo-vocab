import { FormHelperText, Paper, Stack } from "@mui/material";
import React, { PropsWithChildren } from "react";

interface FormProps {
  apiError?: string;
  title?: string;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export function Form({
  apiError,
  title,
  children,
  onSubmit,
}: PropsWithChildren<FormProps>) {
  return (
    <Stack
      sx={{
        width: {
          xs: "80%",
          sm: "33%",
        },
      }}
      alignItems="center"
      spacing={1}
    >
      <Paper sx={{ padding: "2rem", width: "100%" }} elevation={8}>
        {title && <h1>{title}</h1>}
        <form onSubmit={onSubmit}>
          <Stack spacing={4}>{children}</Stack>
        </form>
      </Paper>
      <FormHelperText error>{apiError && apiError}</FormHelperText>
    </Stack>
  );
}
