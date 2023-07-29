import React from "react";
import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
const NewSplitterButton = ({ onClick }) => {
  return (
    <Button variant="outlined" fullWidth onClick={onClick}>
      <AddIcon />
      <span>New Chat</span>
    </Button>
  );
};

export default NewSplitterButton;
