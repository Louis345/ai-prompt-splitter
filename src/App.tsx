import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import TextSplitter from "./Views/TextSplitter/TextSplitter";
import YoutubeTranscript from "./Views/YoutubeTranscript/YoutubeTranscript";
import { useAuth } from "./Context/AuthContext";
import CustomDrawer from "./components/Drawer/Drawer";
import axios from "axios";
import SignIn from "./Views/SignIn/SignIn";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import { Summary, UpdateCollectionParams } from "./types";

function App() {
  const [summaries, setSummaries] = React.useState<Summary[]>([]);

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

        setSummaries(() => {
          const newSummaries = response.data.map((collection: any) => ({
            title: collection.name,
            chunks: collection.chunks,
            id: collection.id,
          }));

          return newSummaries;
        });
      } catch (error) {
        console.error("Failed to fetch collections:", error);
      }
    };

    fetchCollections();
  }, [token]);

  const handleAddCollection = async (
    newTitle?: string
  ): Promise<string | null> => {
    const titleToSend = newTitle ? newTitle : "New Chat";
    try {
      const response = await axios.post(
        "http://localhost:3001/api/collection",
        { name: titleToSend },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const newCollection = {
        title: response.data.name,
        chunks: [],
        id: response.data.id,
      };

      setSummaries((prev) => [...prev, newCollection]);

      // Return the collectionId of the newly created collection
      return newCollection.id;
    } catch (error) {
      console.error("Failed to add new collection:", error);
      return null; // or you can throw the error if needed
    }
  };

  async function updateCollection({
    collectionId,
    newName,
  }: UpdateCollectionParams) {
    try {
      const response = await axios.put(
        `http://localhost:3001/api/collection/${collectionId}`,
        {
          name: newName,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200 && response.data) {
        const updatedCollection = response.data;

        const updatedSummary: Summary = {
          id: updatedCollection.id,
          title: updatedCollection.name,
          chunks: updatedCollection.chunks,
        };

        setSummaries((prevSummaries) => {
          const updatedSummaries = [...prevSummaries];
          const indexToUpdate = updatedSummaries.findIndex(
            (summary) => summary.id === updatedSummary.id
          );

          if (indexToUpdate !== -1) {
            updatedSummaries[indexToUpdate] = updatedSummary;
          }

          return updatedSummaries;
        });
      } else {
        throw new Error("Unexpected response while updating collection");
      }
    } catch (error) {
      console.error("Error updating collection:", error);
      throw error;
    }
  }

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
        const parsedCollectionId = parseInt(collectionId, 10);
        const index = updated.findIndex(
          (item) => item.id === parsedCollectionId
        );
        if (index > -1) {
          updated[index].chunks.push(response.data.text);
        }
        return updated;
      });
    } catch (error) {
      console.error("Failed to add transcript:", error);
    }
  };

  const deleteCollection = async (collectionId: string) => {
    try {
      const response = await axios.delete(
        `http://localhost:3001/api/collection/${collectionId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 204) {
        setSummaries((prevSummaries) => {
          return prevSummaries.filter(
            (summary) => String(summary.id) !== collectionId
          );
        });
      } else {
        console.error(
          "Unexpected response status when deleting the collection:",
          response.status
        );
      }
    } catch (error) {
      console.error("Error occurred while deleting the collection:", error);
    }
  };

  return (
    <div className="App">
      <Router>
        <CustomDrawer
          open={open}
          setOpen={setOpen}
          onClear={() => {}}
          updateCollection={updateCollection}
          deleteCollection={deleteCollection}
          summaries={summaries}
        />
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route
            path="/summary/:collectionId"
            element={
              <PrivateRoute
                element={
                  <TextSplitter
                    handleAddTranscript={handleAddTranscript}
                    handleAddCollection={handleAddCollection}
                  />
                }
              />
            }
          />
          <Route
            path="/summary"
            element={
              <PrivateRoute
                element={
                  <TextSplitter
                    handleAddTranscript={handleAddTranscript}
                    handleAddCollection={handleAddCollection}
                  />
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
                    updateCollection={updateCollection}
                    handleAddCollection={handleAddCollection}
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
