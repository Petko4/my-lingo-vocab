import { Vocabulary } from "../../types/vocabulary/Vocabulary";
import { VocabularyDTO } from "../../types/vocabulary/VocabularyDTO";

export function vocabularyMapper(response: VocabularyDTO): Vocabulary {
  const {
    id,
    name,
    source_language,
    target_language,
    user_id,
    is_active,
    created_at,
  } = response;
  return {
    id,
    userId: user_id,
    name,
    sourceLanguage: source_language,
    targetLanguage: target_language,
    isActive: is_active,
    createdAt: created_at,
  };
}
