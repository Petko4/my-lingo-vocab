import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useVocabularyApi } from "../../api/vocabulary/vocabularyApi";
import { Vocabulary } from "../../types/vocabulary/Vocabulary";
import { Box, CircularProgress } from "@mui/material";

export const VocabularyDetail = (): JSX.Element => {
  const param = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const { getVocabulary } = useVocabularyApi();
  const [vocabulary, setVocabulary] = useState<Vocabulary | null>(null);
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    const fetchVocabularies = async (id: string) => {
      setIsLoading(true);
      try {
        const data = (await getVocabulary(id)) as Vocabulary;
        setVocabulary(data);
      } catch (error) {
        if (error instanceof Error) {
          setApiError(error.message);
        }
        setApiError("Something went wrong. Try it later.");
      } finally {
        setIsLoading(false);
      }
    };
    if (param.id) {
      fetchVocabularies(param.id);
    }
  }, []);

  if (isLoading) {
    return (
      <Box>
        <CircularProgress />
      </Box>
    );
  }

  if (vocabulary && !isLoading && apiError) {
    return <Box>{apiError}</Box>;
  }

  return <h1>{vocabulary?.name}</h1>;
};
