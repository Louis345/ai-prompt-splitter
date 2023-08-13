import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Typography from "@mui/material/Typography";
import { TextField } from "@mui/material";
import CharacterCount from "../../components/CharacterCount/CharacterCount";
import Instructions from "../../components/Instructions/Instructions";
import { textChunker } from "../../utils/util"; // Import the util function
import ChunksCopier from "../../components/ChunkCopier/ChunkCopier";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../Context/AuthContext";

const DrawerHeader = styled("div")(({ theme }) => ({
  // ... Your styles ...
}));
const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
  open?: boolean;
}>(({ theme, open }) => ({
  // ... Your styles ...
}));

const MAX_CHAR_COUNT = 10000;
interface TextSplitterProps {
  handleAddTranscript: (collectionId: string, transcriptText: string) => void;
}
export default function TextSplitter({
  handleAddTranscript,
}: TextSplitterProps) {
  const { token } = useAuth();
  const { collectionId } = useParams<{ collectionId?: string }>();
  const [open, setOpen] = React.useState(false);
  const [inputText, setInputText] = React.useState("");
  const [chunks, setChunks] = React.useState<string[]>([]);
  const [currentCollection, setCurrentCollection] = React.useState<any>(null);

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

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(event.target.value);
    setChunks(textChunker(event.target.value, MAX_CHAR_COUNT));
  };

  const handleCopy = (chunk: string) => {
    navigator.clipboard.writeText(chunk);
  };
  React.useEffect(() => {
    const fetchCollectionData = async () => {
      if (collectionId) {
        try {
          const response = await axios.get(
            `http://localhost:3001/api/collection/${collectionId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (response.status === 200) {
            setCurrentCollection(response.data);
            setInputText(response.data.chunks.join(" "));
          }
        } catch (error) {
          console.error("Failed to fetch collection:", error);
        }
      }
    };

    fetchCollectionData();
  }, [collectionId]);

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
            onBlur={() => {
              if (collectionId) handleAddTranscript(collectionId, inputText);
            }}
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
