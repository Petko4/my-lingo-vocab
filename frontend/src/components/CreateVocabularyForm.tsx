import { Button, TextField } from "@mui/material";
import { Form } from "./Form";
import { useState } from "react";

export function CreateVocabularyForm() {
  const [sourceLanguage, setSourceLanguage] = useState("");
  const [targetLanguage, setTargetLanguage] = useState("");

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

  return (
    <Form apiError="" onSubmit={() => console.log("new vocab")}>
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
      <Button type="submit" variant="text">
        new vocabulary
      </Button>
    </Form>
  );
}
