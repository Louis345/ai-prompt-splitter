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
    },
    { title: "stock investing", chunks: [] },
  ]);

  const [open, setOpen] = React.useState(false);
  const { token } = useAuth();
  useEffect(() => {
    const fetchCollections = async () => {
      try {
        console.log("token", token);
        if (!token) {
          console.warn("Token is missing. Cannot fetch collections.");
          return;
        }
        console.log("token", token);
        const response = await axios.get(
          "http://localhost:3001/api/collection",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setSummaries(
          response.data.map((collection: any) => ({
            title: collection.name,
            chunks: collection.chunks,
          }))
        );
      } catch (error) {
        console.error("Failed to fetch collections:", error);
      }
    };

    fetchCollections();
  }, [token]);

  return (
    <div className="App">
      <Router>
        <CustomDrawer open={open} setOpen={setOpen} onClear={() => {}} />
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route
            path="/"
            element={<PrivateRoute element={<TextSplitter />} />}
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
