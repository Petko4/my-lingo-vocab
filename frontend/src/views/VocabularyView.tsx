import { PostAdd } from "@mui/icons-material";
import {
  Box,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Typography,
} from "@mui/material";

export function VocabularyView() {
  return (
    <Box>
      <Typography variant="h4">Vocabulary</Typography>
      <SpeedDial
        ariaLabel="vocabulary speed dial"
        icon={<SpeedDialIcon />}
        sx={{ position: "absolute", bottom: 16, left: 16 }}
      >
        <SpeedDialAction
          key="create"
          icon={<PostAdd />}
          tooltipTitle="New vocabulary"
        />
      </SpeedDial>
    </Box>
  );
}
