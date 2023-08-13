import React from "react";
import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";

type NewSplitterButtonProps = {
  onClick: () => void;
};

const NewSplitterButton: React.FC<NewSplitterButtonProps> = ({ onClick }) => {
  return (
    <Button variant="outlined" fullWidth onClick={onClick}>
      <AddIcon />
      <span>New Chat</span>
    </Button>
  );
};

export default NewSplitterButton;
