import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import TextSplitter from "./Views/TextSplitter/TextSplitter";
import YoutubeTranscript from "./Views/YoutubeTranscript/YoutubeTranscript";
import { useAuth } from "./Context/AuthContext";
import CustomDrawer from "./components/Drawer/Drawer";
import axios from "axios";
import SignIn from "./Views/SignIn/SignIn";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";

function App() {
  const [summaries, setSummaries] = React.useState([
    {
      title: "Real Estate",
      chunks: ["test"],
      id: 50,
    },
  ]);

  const [open, setOpen] = React.useState(false);
  const { token } = useAuth();
  useEffect(() => {
    const fetchCollections = async () => {
      try {
        if (!token) {
          console.warn("Token is missing. Cannot fetch collections.");
          return;
        }

        const response = await axios.get(
          "http://localhost:3001/api/collection",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setSummaries((prevSummaries) => {
          const newSummaries = response.data.map((collection: any) => ({
            title: collection.name,
            chunks: collection.chunks,
            id: collection.id,
          }));

          return [...prevSummaries, ...newSummaries];
        });
      } catch (error) {
        console.error("Failed to fetch collections:", error);
      }
    };

    fetchCollections();
  }, [token]);

  const handleAddCollection = async (newTitle: string) => {
    try {
      const response = await axios.post(
        "http://localhost:3001/api/collection",
        { name: newTitle },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSummaries((prev) => [
        ...prev,
        {
          title: response.data.name,
          chunks: [],
        },
      ]);
    } catch (error) {
      console.error("Failed to add new collection:", error);
    }
  };
  const handleAddTranscript = async (
    collectionId: string,
    transcriptText: string
  ) => {
    try {
      const response = await axios.post(
        `http://localhost:3001/api/collection/${collectionId}/chunks`,
        { text: transcriptText },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSummaries((prev) => {
        const updated = [...prev];
        const index = updated.findIndex((item) => item.id === collectionId);
        if (index > -1) {
          updated[index].chunks.push(response.data.text);
        }
        return updated;
      });
    } catch (error) {
      console.error("Failed to add transcript:", error);
    }
  };

  return (
    <div className="App">
      <Router>
        <CustomDrawer
          open={open}
          setOpen={setOpen}
          onClear={() => {}}
          createCollection={handleAddCollection}
          summaries={summaries}
          setSummaries={setSummaries}
        />
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route
            path="/summary/:collectionId"
            element={
              <PrivateRoute
                element={
                  <TextSplitter handleAddTranscript={handleAddTranscript} />
                }
              />
            }
          />
          <Route
            path="/summary"
            element={
              <PrivateRoute
                element={
                  <TextSplitter handleAddTranscript={handleAddTranscript} />
                }
              />
            }
          />
          <Route
            path="/youtube-transcript"
            element={
              <PrivateRoute
                element={
                  <YoutubeTranscript
                    //@ts-ignore
                    summaries={summaries}
                    setSummaries={setSummaries}
                  />
                }
              />
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
