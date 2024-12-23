import { Button, FormHelperText, Paper, Stack, TextField } from "@mui/material";
import React, { useRef, useState } from "react";
import { SignUpFormData } from "../types/User";
import {
  DEBOUNCE_VALIDATION_TIMEOUT,
  EMAIL_VALIDATION_PATTERN,
  PASSWORD_VALIDATION_PATTERN,
} from "../constants";

interface SignUpFormProps {
  onSubmit: (data: SignUpFormData) => Promise<void>;
  isLoading: boolean;
  apiError: string | undefined;
}

export function SignUpForm({ onSubmit, isLoading, apiError }: SignUpFormProps) {
  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const nameDebounceTimer = useRef<undefined | number>(undefined);
  const emailDebounceTimer = useRef<undefined | number>(undefined);
  const passwordDebounceTimer = useRef<undefined | number>(undefined);

  const handleOnSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit({
      username,
      email,
      password,
    });
  };

  const handleUsernameOnChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newUsername = event.target.value;

    setUsernameError("");
    setUsername(newUsername);

    if (nameDebounceTimer.current) {
      clearTimeout(nameDebounceTimer.current);
    }
    nameDebounceTimer.current = setTimeout(() => {
      if (!newUsername || newUsername.length <= 3) {
        setUsernameError("Username has to be at least 4 characters");
      }
    }, DEBOUNCE_VALIDATION_TIMEOUT);
  };

  const handleEmailOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = event.target.value;

    setEmailError("");
    setEmail(newEmail);

    if (emailDebounceTimer.current) {
      clearTimeout(emailDebounceTimer.current);
    }
    emailDebounceTimer.current = setTimeout(() => {
      if (!EMAIL_VALIDATION_PATTERN.test(newEmail)) {
        setEmailError(
          "The email address must be in format example@example.com"
        );
      }
    }, DEBOUNCE_VALIDATION_TIMEOUT);
  };

  const handlePasswordOnChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newPassword = event.target.value;

    setPasswordError("");
    setPassword(newPassword);

    if (passwordDebounceTimer.current) {
      clearTimeout(passwordDebounceTimer.current);
    }
    passwordDebounceTimer.current = setTimeout(() => {
      if (!PASSWORD_VALIDATION_PATTERN.test(newPassword)) {
        setPasswordError(
          "Password has to contain at least 8 characters, digits, uppercase, lowercase and special character"
        );
      }
    }, DEBOUNCE_VALIDATION_TIMEOUT);
  };

  return (
    <Stack sx={{ width: "20%" }} alignItems="center" spacing={1}>
      <Paper sx={{ padding: "2rem", width: "100%" }} elevation={8}>
        <h1>Sign up</h1>
        <form onSubmit={handleOnSubmit}>
          <Stack spacing={4}>
            <TextField
              id="username"
              label="username"
              name="username"
              variant="standard"
              required
              value={username}
              onChange={handleUsernameOnChange}
              error={!!usernameError}
              helperText={usernameError}
            />
            <TextField
              id="email"
              label="email"
              name="email"
              type="email"
              variant="standard"
              value={email}
              onChange={handleEmailOnChange}
              required
              error={!!emailError}
              helperText={emailError}
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
              error={!!passwordError}
              helperText={passwordError}
            />
            <Button
              type="submit"
              variant="text"
              sx={{
                ":focus": {
                  outline: "none",
                },
              }}
              disabled={isLoading}
            >
              {isLoading ? <>Sigining up&hellip;</> : "Sign Up"}
            </Button>
          </Stack>
        </form>
      </Paper>
      <FormHelperText error>{apiError && apiError}</FormHelperText>
    </Stack>
  );
}
