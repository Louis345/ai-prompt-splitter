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

const MAX_CHAR_COUNT = 10000;
interface TranscriptResponse {
  text: string;
  start: number;
}

function YoutubeTranscript() {
  const [url, setUrl] = useState<string>("");
  const [transcript, setTranscript] = useState<string>("");
  const [chunks, setChunks] = useState<string[]>([]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    try {
      const response: AxiosResponse<{ result: TranscriptResponse[] }> =
        await axios.get(`http://localhost:3001/api/transcriptApi/?url=${url}`);

      const rawTranscriptArray = response.data.result;

      const formattedTranscript = rawTranscriptArray
        .map((obj: any) => {
          const time = new Date(obj.start * 1000).toISOString().substr(11, 8);
          return `${time} - ${obj.text}`;
        })
        .join("\n");

      const transcriptText = (
        formattedTranscript.match(/[^\.!\?]+[\.!\?]+/g) || ([] as string[])
      ).reduce((acc, curr, i) => {
        return i % 10 === 0 ? `${acc}\n\n${curr}` : `${acc} ${curr}`;
      }, "");

      setTranscript(transcriptText);
      const chunksArray = textChunker(transcriptText, MAX_CHAR_COUNT);
      setChunks(chunksArray);
    } catch (error) {
      console.error(error);
    }
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

      {chunks.length > 1 && <Instructions />}
    </Box>
  );
}

export default YoutubeTranscript;
