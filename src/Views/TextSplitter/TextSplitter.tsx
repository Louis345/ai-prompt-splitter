import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import { Button, TextField } from "@mui/material";
import CharacterCount from "../../components/CharacterCount/CharacterCount";
import Instructions from "../../components/Instructions/Instructions";
import { textChunker } from "../../utils/util";
import ChunksCopier from "../../components/ChunkCopier/ChunkCopier";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../Context/AuthContext";

const DrawerHeader = styled("div")(({ theme }) => ({}));

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
  open?: boolean;
}>(({ theme, open }) => ({}));

const MAX_CHAR_COUNT = 10000;

interface TextSplitterProps {
  handleAddTranscript: (collectionId: string, transcriptText: string) => void;
  handleAddCollection: (collectionTitle?: string) => Promise<string | null>;
}

export default function TextSplitter({
  handleAddTranscript,
  handleAddCollection,
}: TextSplitterProps) {
  const { token } = useAuth();
  const { collectionId } = useParams<{ collectionId?: string }>();
  const [inputText, setInputText] = React.useState("");
  const [chunks, setChunks] = React.useState<string[]>([]);

  const handleClearChat = () => {
    setInputText("");
    setChunks([]);
  };

  const handleCopy = (chunk: string) => {
    navigator.clipboard.writeText(chunk);
  };

  const saveCollection = async () => {
    if (collectionId) {
      handleAddTranscript(collectionId, inputText);
    } else {
      const newCollectionId = await handleAddCollection("My New Collection");
      if (newCollectionId) {
        handleAddTranscript(newCollectionId, inputText);
      }
    }
  };

  React.useEffect(() => {
    const fetchCollectionData = async () => {
      if (collectionId) {
        try {
          const response = await axios.get(`/api/collection/${collectionId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (response.status === 200) {
            console.log("Successfully fetched collection:", response.data);
            const retrievedText = response.data.text;
            setInputText(retrievedText);
            setChunks(textChunker(retrievedText, MAX_CHAR_COUNT));
          }
        } catch (error) {
          console.error("Failed to fetch collection:", error);
        }
      }
    };
    if (collectionId) {
      fetchCollectionData();
    }
  }, [collectionId, token]);

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const textValue = event.target.value;
    setInputText(textValue);
    setChunks(textChunker(textValue, MAX_CHAR_COUNT));
  };

  return (
    <Box
      sx={{
        overflowY: "auto",
        flexDirection: "column",
        justifyContent: "center",
        width: "80%",
        margin: "0 auto",
      }}
    >
      <CssBaseline />

      <Main>
        <DrawerHeader />

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            flex: "1",
            justifyContent: "flex-end",
            marginTop: "80px",
          }}
        >
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
            style={{ marginBottom: "16px" }}
            onBlur={() => {
              if (collectionId) handleAddTranscript(collectionId, inputText);
            }}
          />
          <ChunksCopier chunks={chunks} handleCopy={handleCopy} />
          {inputText.length > MAX_CHAR_COUNT && (
            <Box>
              <Typography sx={{ marginTop: "1rem", fontSize: "0.875rem" }}>
                This way we explain ChatGPT how to process the messages we are
                gonna send.
              </Typography>
              <Instructions />
            </Box>
          )}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",

              flexWrap: "wrap",
              marginTop: "1rem",
            }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={saveCollection}
              sx={{ margin: "1rem 0", width: "100%" }}
            >
              Save Chat
            </Button>
            <Button
              variant="contained"
              color="success"
              onClick={handleClearChat}
              sx={{ margin: "1rem 0", width: "100%" }}
            >
              Clear Chat
            </Button>
          </Box>
        </Box>
      </Main>
    </Box>
  );
}
