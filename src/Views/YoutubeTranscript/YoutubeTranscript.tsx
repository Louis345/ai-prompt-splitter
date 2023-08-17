import React, { FormEvent, useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import axios, { AxiosResponse } from "axios";
import ChunksCopier from "../../components/ChunkCopier/ChunkCopier";
import { textChunker } from "../../utils/util";
import Instructions from "../../components/Instructions/Instructions";
import CharacterCount from "../../components/CharacterCount/CharacterCount";
import { UpdateCollectionParams } from "../../types";

const MAX_CHAR_COUNT = 10000;
interface TranscriptResponse {
  text: string;
  start: number;
}

interface YoutubeTranscriptProps {
  handleAddTranscript: (collectionId: string, transcriptText: string) => void;
  handleAddCollection: (
    newTitle?: string | undefined
  ) => Promise<string | null>;
}

function YoutubeTranscript({
  handleAddTranscript,
  handleAddCollection,
}: YoutubeTranscriptProps) {
  const [url, setUrl] = useState<string>("");
  const [transcript, setTranscript] = useState<string>("");
  const [chunks, setChunks] = useState<string[]>([]);
  const [currentCollection, setCurrentCollection] = useState<any>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    try {
      const response: AxiosResponse<{ result: TranscriptResponse[] }> =
        await axios.get(`/api/transcriptApi/?url=${url}`);

      const rawTranscriptArray = response.data.result;

      const transcriptLines = rawTranscriptArray
        .map((obj) => obj.text)
        .join(" ")
        .split(/\.|!|\?/g)
        .filter((sentence) => sentence.trim() !== "");

      const structuredTranscriptText = transcriptLines.reduce(
        (acc, curr, i) => {
          let newLineAfterSentence = `${curr.trim()}.\n`;
          if ((i + 1) % 3 === 0) {
            newLineAfterSentence += "\n";
          }
          return acc + newLineAfterSentence;
        },
        ""
      );

      const chunksArray = textChunker(structuredTranscriptText, MAX_CHAR_COUNT);

      setTranscript(structuredTranscriptText);
      setChunks(chunksArray);
    } catch (error) {
      console.error(error);
    }
  };

  const saveCollection = async () => {
    try {
      // First, create a new collection or use the existing one.
      let collectionId = currentCollection?.id;

      if (!collectionId) {
        collectionId = await handleAddCollection("My YouTube Chat");
      }

      // Check if a collection ID is available.
      if (!collectionId) {
        console.error("Failed to get collection ID");
        return;
      }

      // Add transcript chunks to the collection.
      await handleAddTranscript(collectionId, chunks.toString());

      console.log("Successfully saved the transcript!");
    } catch (error) {
      console.error("Error while saving the collection:", error);
    }
  };

  const clearCollection = () => {
    setUrl("");
    setTranscript("");
    setChunks([]);
    setCurrentCollection(null);
  };

  const handleCopy = (chunk: string) => {
    navigator.clipboard.writeText(chunk);
  };

  return (
    <Box
      component={Paper}
      p={2}
      sx={{
        maxWidth: "600px",
        margin: "50px auto",
        textAlign: "center",
        bgcolor: "background.paper",
      }}
    >
      <Typography variant="h5" gutterBottom>
        Youtube Transcript
      </Typography>
      <CharacterCount inputText={transcript} />

      <form onSubmit={handleSubmit} noValidate autoComplete="off">
        <TextField
          fullWidth
          label="Youtube URL"
          variant="outlined"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          sx={{ marginBottom: "20px" }}
        />
        <Button type="submit" variant="contained" color="primary">
          Generate Transcript
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={clearCollection}
          sx={{ margin: "1rem 0", width: "100%" }}
        >
          Clear Collection
        </Button>
        <Button
          variant="contained"
          color="success"
          onClick={saveCollection}
          sx={{ margin: "1rem 0", width: "100%" }}
        >
          Save Collection
        </Button>
      </form>

      <Box
        sx={{
          height: "300px",
          overflowY: "auto",
          marginTop: "20px",
          fontFamily: "Courier New",
          lineHeight: 1.6,
          whiteSpace: "pre-wrap",
        }}
      >
        <Typography variant="body1">{transcript}</Typography>
      </Box>
      <Box
        display="flex"
        justifyContent="center"
        width="100%"
        sx={{ marginTop: "20px" }}
      >
        <ChunksCopier chunks={chunks} handleCopy={handleCopy} />
      </Box>

      {chunks.length > 0 && <Instructions />}
    </Box>
  );
}

export default YoutubeTranscript;
