import { useEffect, useState } from "react";
import { useVocabularyApi } from "../../api/vocabulary/vocabularyApi";
import { Vocabulary } from "../../types/vocabulary/Vocabulary";
import { VocabularyRow } from "./VocabularyRow";
import {
  alpha,
  Box,
  Checkbox,
  CircularProgress,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

export function VocabularyList() {
  const { getVocabularies, deleteVocabularies } = useVocabularyApi();
  const [vocabularies, setVocabularies] = useState<Array<Vocabulary>>([]);
  const [selectedVocabularies, setSelectedVocabularies] = useState<Set<number>>(
    new Set()
  );
  const [apiError, setApiError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchVocabularies = async () => {
      setIsLoading(true);
      try {
        const data = (await getVocabularies()) as Array<Vocabulary>;
        setVocabularies(data);
      } catch (error) {
        if (error instanceof Error) {
          setApiError(error.message);
        }
        setApiError("Something went wrong. Try it later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchVocabularies();
  }, []);

  const handleOnSelect = (id: number) => {
    setSelectedVocabularies((prev) => {
      const newSelected = new Set(prev);
      if (newSelected.has(id)) {
        newSelected.delete(id);
      } else {
        newSelected.add(id);
      }
      return newSelected;
    });
  };

  const handleOnSelectAll = () => {
    setSelectedVocabularies((prev) => {
      const newSelected = new Set(prev);
      if (newSelected.size === vocabularies.length) {
        newSelected.clear();
      } else {
        vocabularies.forEach((v) => newSelected.add(v.id));
      }
      return newSelected;
    });
  };

  const handleOnDeleteClick = async () => {
    if (selectedVocabularies.size === 0) {
      return;
    }
    setIsLoading(true);
    try {
      await deleteVocabularies(selectedVocabularies);
      setVocabularies((prevVocabularies) =>
        prevVocabularies.filter(
          (vocabulary) => !selectedVocabularies.has(vocabulary.id)
        )
      );
      setSelectedVocabularies(new Set<number>());
    } catch (error) {
      if (error instanceof Error) {
        setApiError(error.message);
      }
      setApiError("Something went wrong. Try it later.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Box>
        <CircularProgress />
      </Box>
    );
  }

  if (vocabularies && !isLoading && apiError) {
    return <Box>{apiError}</Box>;
  }

  return (
    <Box>
      <Toolbar
        sx={[
          {
            pl: { sm: 2 },
            pr: { xs: 1, sm: 1 },
          },
          selectedVocabularies.size > 0 && {
            bgcolor: (theme) =>
              alpha(
                theme.palette.primary.main,
                theme.palette.action.activatedOpacity
              ),
          },
        ]}
      >
        {selectedVocabularies.size > 0 ? (
          <Typography
            sx={{ flex: "1 1 100%" }}
            color="inherit"
            variant="subtitle1"
            component="div"
          >
            {selectedVocabularies.size} selected
          </Typography>
        ) : (
          <Typography
            sx={{ flex: "1 1 100%" }}
            variant="h6"
            id="tableTitle"
            component="div"
          >
            Vocabularies
          </Typography>
        )}
        {selectedVocabularies.size > 0 && (
          <Tooltip title="Delete">
            <IconButton onClick={handleOnDeleteClick}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        )}
      </Toolbar>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  color="primary"
                  indeterminate={
                    selectedVocabularies.size > 0 &&
                    selectedVocabularies.size < vocabularies.length
                  }
                  checked={
                    vocabularies.length > 0 &&
                    selectedVocabularies.size === vocabularies.length
                  }
                  onChange={handleOnSelectAll}
                  inputProps={{
                    "aria-label": "select all desserts",
                  }}
                />
              </TableCell>
              <TableCell key="name">Name</TableCell>
              <TableCell key="sourceLanguage">Source language</TableCell>
              <TableCell key="targetLanguage">Target language</TableCell>
              {/* <TableCell key="isActive">Is Active</TableCell> */}
              <TableCell key="createAt">Create at</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {vocabularies?.map((vocabulary) => (
              <VocabularyRow
                key={vocabulary.id}
                vocabulary={vocabulary}
                isSelected={selectedVocabularies.has(vocabulary.id)}
                onSelect={handleOnSelect}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
