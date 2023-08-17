import { Button, TextField, Box, Typography } from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import { useAuth } from "../../Context/AuthContext";
import { useNavigate } from "react-router-dom";

const SignIn: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setToken } = useAuth();

  const navigate = useNavigate();
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await axios.post("/api/signin", {
        username,
        password,
      });

      if (response.status === 200 && response.data.token) {
        console.log("Successfully signed in:", response.data);
        setToken(response.data.token);
        navigate("/summary");
      } else {
        console.error("Failed to sign in:", response.data);
      }
    } catch (err) {
      console.error("API call failed:", err);
    }
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      height="100vh"
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ maxWidth: 400, margin: "auto", textAlign: "center" }}
      >
        <Typography variant="h5" gutterBottom>
          Sign In
        </Typography>
        <TextField
          fullWidth
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          margin="normal"
        />
        <TextField
          fullWidth
          type="password"
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          margin="normal"
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
        >
          Submit
        </Button>
      </Box>
    </Box>
  );
};

export default SignIn;
