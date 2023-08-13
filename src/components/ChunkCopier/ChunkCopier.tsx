import React from "react";
import { Chip, Box } from "@mui/material";

interface ChunksCopierProps {
  chunks: string[];
  handleCopy: (chunk: string) => void;
}

const ChunksCopier: React.FC<ChunksCopierProps> = ({ chunks, handleCopy }) => {
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
          onClick={() => handleCopy(chunk)}
          key={index}
        />
      ))}
    </Box>
  ) : null;
};

export default ChunksCopier;
