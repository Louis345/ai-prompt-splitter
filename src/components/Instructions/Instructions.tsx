import React from "react";
import { TextField, Typography, Button, Box } from "@mui/material";

const INSTRUCTIONS = `
  The total length of the content that I want to send you is too large to send in only one piece.
  For sending you that content, I will follow this rule:
  [START PART 1/10]
  this is the content of the part 1 out of 10 in total
  [END PART 1/10]
  Then you just answer: "Received part 1/10"
  And when I tell you "ALL PARTS SENT", then you can continue processing the data and answering my requests.
`;

const Instructions = () => {
  const handleInstructionsCopy = () => {
    navigator.clipboard.writeText(INSTRUCTIONS);
  };

  return (
    <Box>
      <TextField
        id="outlined-multiline-static"
        label="Instructions"
        multiline
        rows={10}
        defaultValue={INSTRUCTIONS}
        variant="outlined"
        fullWidth
        disabled
        sx={{
          backgroundColor: "#f7f7f7",
          marginBottom: "1rem",
          marginTop: "1rem",
        }}
      />
      <Typography sx={{ marginTop: "1rem", fontSize: "0.875rem" }}>
        This way we explain ChatGPT how to process the messages we are gonna
        send.
      </Typography>
      <Button
        variant="contained"
        color="success"
        onClick={handleInstructionsCopy}
        sx={{ margin: "1rem 0", width: "100%" }}
      >
        Copy Instructions (first message to send)
      </Button>
    </Box>
  );
};

export default Instructions;
