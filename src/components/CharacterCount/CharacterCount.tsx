import { Typography } from "@mui/material";
import React from "react";

interface CharacterCountProps {
  inputText: string;
}

const CharacterCount: React.FC<CharacterCountProps> = ({ inputText }) => {
  return (
    <Typography align="right" variant="body2" color="textSecondary">
      Character Count: {inputText.length}
    </Typography>
  );
};

export default CharacterCount;
