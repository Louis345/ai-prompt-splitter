import React, { useState } from "react";
import { Chip, Box, Snackbar } from "@mui/material";
import Alert from "@mui/material/Alert";

interface ChunksCopierProps {
  chunks: string[];
  handleCopy: (chunk: string) => void;
}

const ChunksCopier: React.FC<ChunksCopierProps> = ({ chunks, handleCopy }) => {
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleCopyAndNotify = (chunk: string) => {
    handleCopy(chunk);
    setOpenSnackbar(true);
  };

  const handleClose = () => {
    setOpenSnackbar(false);
  };

  return chunks.length >= 1 ? (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        gap: "1rem",
        marginBottom: "1rem",
      }}
    >
      {chunks.map((chunk, index) => (
        <Chip
          label={`Copy Chunk ${index + 1} to Clipboard`}
          clickable
          color="primary"
          onClick={() => handleCopyAndNotify(chunk)}
          key={index}
        />
      ))}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={1000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleClose} severity="success" variant="filled">
          Copied to clipboard!
        </Alert>
      </Snackbar>
    </Box>
  ) : null;
};

export default ChunksCopier;
