import React, { useEffect } from "react";
import { putioAPI } from "../utils";
import Button from "@mui/material/Button";

const loginUrl = putioAPI.Auth.GetLoginURL({
  redirectURI: "https://random-put-file.vercel.app/oauth/callback",
  responseType: "token",
  state: "",
  clientName: "Random File",
});

export default function Login() {
  const login = () => {
    window.location = loginUrl;
  };

  return (
    <div className="App">
      <header className="App-header">
        <Button variant="contained" onClick={login}>
          Login to Put.io
        </Button>
      </header>
    </div>
  );
}
