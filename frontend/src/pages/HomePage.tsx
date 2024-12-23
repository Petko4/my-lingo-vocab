import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { Button } from "@mui/material";

export function HomePage() {
  const { signOut } = useContext(AuthContext);

  return (
    <>
      <h1>Home Page</h1>
      <Button onClick={signOut}>Sign out</Button>
    </>
  );
}
