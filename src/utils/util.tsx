export const textChunker = (text: string, maxCharCount: number): string[] => {
  const numChunks = Math.ceil(text.length / maxCharCount);
  const chunksArray: string[] = [];

  for (let i = 0; i < numChunks; i++) {
    const start = i * maxCharCount;
    const end = start + maxCharCount;
    const chunk = text.slice(start, end);
    let formattedChunk = `Do not answer yet. This is just another part of the text I want to send you. Just receive and acknowledge as "[START PART ${
      i + 1
    } received" and wait for the next part. /${numChunks}]\n${chunk}\n[END PART ${
      i + 1
    }/${numChunks}]`;
    if (i !== numChunks - 1) {
      formattedChunk +=
        "\nPart " +
        (i + 1) +
        "/" +
        numChunks +
        " received. Awaiting the next part of your message.";
    }
    chunksArray.push(formattedChunk);
  }

  return chunksArray;
};
