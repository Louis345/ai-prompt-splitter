import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import TextSplitter from "./Views/TextSplitter/TextSplitter";
import YoutubeTranscript from "./Views/YoutubeTranscript/YoutubeTranscript";
import CustomDrawer from "./components/Drawer/Drawer";

function App() {
  const [summaries, setSummaries] = React.useState([
    {
      title: "Real Estate",
      chunks: [],
    },
    { title: "stock investing", chunks: [] },
  ]);

  const [open, setOpen] = React.useState(false);

  return (
    <div className="App">
      <Router>
        <CustomDrawer open={open} setOpen={setOpen} />
        <Routes>
          <Route path="/" element={<TextSplitter />} />
          <Route
            path="/youtube-transcript"
            element={
              <YoutubeTranscript
                summaries={summaries}
                setSummaries={setSummaries}
              />
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
