import {
  AppBar,
  Box,
  Button,
  CssBaseline,
  IconButton,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import "./App.css";
import { useContext } from "react";
import { Logout, MenuBook, Person, School } from "@mui/icons-material";
import { AuthContext } from "./contexts/AuthContext";
import { VocabularyView } from "./views/VocabularyView";
import { Route, Routes, useNavigate } from "react-router";
import { ExerciseView } from "./views/ExerciseView";
import { ProfileView } from "./views/ProfileView";

export function App() {
  const { signOut } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <>
      <Stack>
        <Box>
          <CssBaseline />
          <AppBar position="relative" sx={{ height: "4rem" }}>
            <Toolbar>
              <Box sx={{ flexGrow: 1 }}>
                <Button
                  variant="text"
                  onClick={() => navigate("/app/vocabulary")}
                  startIcon={<MenuBook />}
                  color="inherit"
                >
                  Vocabulary
                </Button>
                <Button
                  variant="text"
                  onClick={() => navigate("/app/exercise")}
                  startIcon={<School />}
                  color="inherit"
                >
                  Exercise
                </Button>
              </Box>
              <IconButton
                color="inherit"
                aria-label="sign out"
                edge="end"
                onClick={() => navigate("/app/profile")}
                sx={{ mr: 0 }}
              >
                <Person />
              </IconButton>
              <IconButton
                color="inherit"
                aria-label="sign out"
                edge="end"
                onClick={signOut}
                sx={{ mr: 0 }}
              >
                <Logout />
              </IconButton>
            </Toolbar>
          </AppBar>
        </Box>
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Routes>
            <Route path="/vocabulary" element={<VocabularyView />} />
            <Route path="/exercise" element={<ExerciseView />} />
            <Route path="/profile" element={<ProfileView />} />
          </Routes>
        </Box>
      </Stack>
    </>
  );
}
