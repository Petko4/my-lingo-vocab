import { Button, FormHelperText, Paper, Stack, TextField } from "@mui/material";
import React, { useState } from "react";
import { SignInFormData } from "../types/User";
import { Form } from "./Form";

interface SignInFormProsp {
  onSubmit: (data: SignInFormData) => void;
  isLoading: boolean;
  apiError: string | undefined;
}

export function SignInForm({ isLoading, onSubmit, apiError }: SignInFormProsp) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleUsernameOnChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setUsername(event.target.value);
  };

  const handlePasswordOnChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPassword(event.target.value);
  };

  const handleOnSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit({ username, password });
  };

  return (
    <Form onSubmit={handleOnSubmit} title="Sign in" apiError={apiError}>
      <TextField
        id="username"
        label="username"
        name="username"
        variant="standard"
        required
        value={username}
        onChange={handleUsernameOnChange}
      />

      <TextField
        id="password"
        label="password"
        type="password"
        name="password"
        variant="standard"
        value={password}
        onChange={handlePasswordOnChange}
        required
      />
      <Button type="submit" variant="text" disabled={isLoading}>
        {isLoading ? <>Sigining in&hellip;</> : "Sign in"}
      </Button>
    </Form>
  );
}
