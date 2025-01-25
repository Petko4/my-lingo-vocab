import { API_URL } from "../../constants";
import { useSecureFetch } from "../../hooks/useSecureFetch";
import { Vocabulary } from "../../types/vocabulary/Vocabulary";
import { VocabularyDTO } from "../../types/vocabulary/VocabularyDTO";
import { vocabularyMapper } from "./vocabularyMapper";

const VOCABULARY_URL = `${API_URL}/vocabulary`;

export function useVocabularyApi() {
  const secureFetch = useSecureFetch();

  const getVocabularies = async (): Promise<Array<Vocabulary> | Error> => {
    try {
      const response = await secureFetch(`${VOCABULARY_URL}`, {
        method: "GET",
      });

      if (!response.ok) {
        console.error(response);
        throw new Error(response.statusText);
      }

      const jsonResponse = (await response.json()) as Array<VocabularyDTO>;

      return jsonResponse.map(vocabularyMapper);
    } catch (err) {
      if (err instanceof Error) {
        return err;
      }
      return new Error("Unknown error occurred");
    }
  };

  const getVocabulary = async (id: string): Promise<Vocabulary | Error> => {
    try {
      const response = await secureFetch(`${VOCABULARY_URL}/${id}`, {
        method: "GET",
      });

      if (!response.ok) {
        console.error(response);
        throw new Error(response.statusText);
      }

      const jsonResponse = (await response.json()) as VocabularyDTO;

      return vocabularyMapper(jsonResponse);
    } catch (err) {
      if (err instanceof Error) {
        return err;
      }
      return new Error("Unknown error occurred");
    }
  };

  const createVocabulary = async (
    sourceLanugage: string,
    targetLanguage: string
  ): Promise<Vocabulary | Error> => {
    try {
      const payload = {
        source_language: sourceLanugage,
        target_language: targetLanguage,
      };
      const response = await secureFetch(VOCABULARY_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const jsonResponse = (await response.json()) as VocabularyDTO;

      if (response.status !== 200) {
        console.error(response);
        throw new Error(response.statusText);
      }
      return vocabularyMapper(jsonResponse);
    } catch (err) {
      if (err instanceof Error) {
        return err;
      }
      return new Error("Unknown error occurred");
    }
  };

  const deleteVocabularies = async (ids: Set<number>) => {
    const payload = {
      ids: Array.from(ids),
    };
    try {
      const response = await secureFetch(`${VOCABULARY_URL}/bulk-delete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const jsonResponse = (await response.json()) as Array<VocabularyDTO>;
      if (response.status !== 200) {
        console.error(response);
        throw new Error(response.statusText);
      }
      return jsonResponse.map(vocabularyMapper);
    } catch (err) {
      if (err instanceof Error) {
        return err;
      }
      return new Error("Unknown error occurred");
    }
  };

  return {
    getVocabularies,
    getVocabulary,
    createVocabulary,
    deleteVocabularies,
  };
}
