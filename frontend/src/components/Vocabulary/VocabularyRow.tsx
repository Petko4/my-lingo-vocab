import { TableCell, TableRow, Checkbox, Link } from "@mui/material";
import { Vocabulary } from "../../types/vocabulary/Vocabulary";
import { Link as RouterLink } from "react-router-dom";

interface VocabularyRowProps {
  vocabulary: Vocabulary;
  isSelected: boolean;
  onSelect: (id: number) => void;
}

export const VocabularyRow = ({
  vocabulary,
  isSelected,
  onSelect,
}: VocabularyRowProps): JSX.Element => {
  console.log(
    <Link component={RouterLink} to={`/app/vocabulary/${vocabulary.id}`}>
      test
    </Link>
  );
  return (
    <TableRow>
      <TableCell padding="checkbox">
        <Checkbox
          color="primary"
          checked={isSelected}
          onClick={() => onSelect(vocabulary.id)}
        />
      </TableCell>
      <TableCell>
        <Link component={RouterLink} to={`/app/vocabulary/${vocabulary.id}`}>
          test
        </Link>
      </TableCell>
      <TableCell>{vocabulary.sourceLanguage}</TableCell>
      <TableCell>{vocabulary.targetLanguage}</TableCell>
      {/* <TableCell>{vocabulary.isActive ? "true" : "false"}</TableCell> */}
      <TableCell>{vocabulary.createdAt}</TableCell>
    </TableRow>
  );
};
