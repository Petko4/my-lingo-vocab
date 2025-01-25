import { PostAdd } from "@mui/icons-material";
import {
  Box,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Typography,
} from "@mui/material";
import { CreateVocabularyForm } from "../components/Vocabulary/CreateVocabularyForm";
import { Route, Routes, useNavigate } from "react-router";
import { VocabularyDetail } from "../components/Vocabulary/VocabularyDetail";
import { VocabularyList } from "../components/Vocabulary/VocabularyList";

export function VocabularyView() {
  const navigate = useNavigate();
  return (
    <Box>
      <Typography variant="h4">Vocabulary</Typography>
      <Box
        sx={{
          flexGrow: 1,
          justifyItems: "center",
          alignItems: "center",
          alignContent: "center",
        }}
      >
        <Routes>
          <Route path="/create" element={<CreateVocabularyForm />} />
          <Route path="/all" element={<VocabularyList />} />
          <Route path="/:id" element={<VocabularyDetail />} />
        </Routes>
      </Box>
      <SpeedDial
        ariaLabel="vocabulary speed dial"
        icon={<SpeedDialIcon />}
        sx={{ position: "absolute", bottom: 16, left: 16 }}
      >
        <SpeedDialAction
          key="create"
          icon={<PostAdd />}
          tooltipTitle="New vocabulary"
          onClick={() => navigate("/app/vocabulary/create")}
        />
      </SpeedDial>
    </Box>
  );
}
