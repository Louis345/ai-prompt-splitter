import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Typography from "@mui/material/Typography";
import { TextField, Chip } from "@mui/material";
import CharacterCount from "../../components/CharacterCount/CharacterCount";
import Instructions from "../../components/Instructions/Instructions";
import { textChunker } from "../../utils/util"; // Import the util function
import ChunksCopier from "../../components/ChunkCopier/ChunkCopier";

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const DrawerHeader = styled("div")(({ theme }) => ({
  // ... Your styles ...
}));
const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
  open?: boolean;
}>(({ theme, open }) => ({
  // ... Your styles ...
}));

const MAX_CHAR_COUNT = 10000;

export default function TextSplitter() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [inputText, setInputText] = React.useState("");
  const [chunks, setChunks] = React.useState([]);
  const [summaries, setSummaries] = React.useState([
    {
      title: "Real Estate",
      chunks: [],
    },
    { title: "stock investing", chunks: [] },
  ]);

  const onClear = () => {
    setInputText("");
    setChunks([]);
  };

  const handleTextChange = (event) => {
    setInputText(event.target.value);
    setChunks(textChunker(event.target.value, MAX_CHAR_COUNT)); // Use the util function
  };

  const handleCopy = (chunk: string) => {
    navigator.clipboard.writeText(chunk);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        width: "80%",
        margin: "0 auto",
      }}
    >
      <CssBaseline />

      <Main open={open}>
        <DrawerHeader />

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            flex: "1",
            justifyContent: "flex-end",
            height: "100vh",
          }}
        >
          <ChunksCopier chunks={chunks} handleCopy={handleCopy} />

          <CharacterCount inputText={inputText} />
          <TextField
            id="outlined-multiline-static"
            label="Paste Transcription Here"
            multiline
            rows={4}
            value={inputText}
            onChange={handleTextChange}
            variant="outlined"
            fullWidth
          />
          {inputText.length > MAX_CHAR_COUNT && (
            <Box>
              <Typography sx={{ marginTop: "1rem", fontSize: "0.875rem" }}>
                This way we explain ChatGPT how to process the messages we are
                gonna send.
              </Typography>
              <Instructions />
            </Box>
          )}
        </Box>
      </Main>
    </Box>
  );
}
