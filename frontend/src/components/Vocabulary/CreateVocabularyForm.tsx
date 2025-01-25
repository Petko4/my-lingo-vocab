import { Button, TextField } from "@mui/material";
import { Form } from "../Form";
import { useState } from "react";
import { useVocabularyApi } from "../../api/vocabulary/vocabularyApi";
import { useNavigate } from "react-router";
import { Vocabulary } from "../../types/vocabulary/Vocabulary";

export function CreateVocabularyForm() {
  const [sourceLanguage, setSourceLanguage] = useState("");
  const [targetLanguage, setTargetLanguage] = useState("");
  const [apiError, setApiError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { createVocabulary } = useVocabularyApi();

  const handleSourceLanguageOnChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSourceLanguage(event.target.value);
  };
  const handleTargetLanguageOnChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setTargetLanguage(event.target.value);
  };

  const handleOnSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const vocabulary = (await createVocabulary(
        sourceLanguage,
        targetLanguage
      )) as Vocabulary;

      navigate(`/app/vocabulary/${vocabulary.id}`);
    } catch (error) {
      if (error instanceof Error) {
        setApiError(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form apiError={apiError} onSubmit={handleOnSubmit}>
      <TextField
        id="sourceLanugage"
        label="source lanugage"
        name="sourceLanugage"
        variant="standard"
        required
        value={sourceLanguage}
        onChange={handleSourceLanguageOnChange}
      />
      <TextField
        id="targetLanguage"
        label="target language"
        type="targetLanguage"
        name="targetLanguage"
        variant="standard"
        value={targetLanguage}
        onChange={handleTargetLanguageOnChange}
        required
      />
      <Button type="submit" variant="text" disabled={isLoading}>
        {isLoading ? "creating new vocabulary..." : "new vocabulary"}
      </Button>
    </Form>
  );
}
