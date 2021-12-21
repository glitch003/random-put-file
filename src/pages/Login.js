import React, { useEffect } from "react";
import { putioAPI } from "../utils";

const loginUrl = putioAPI.Auth.GetLoginURL({
  redirectURI: "http://localhost:3002/oauth/callback",
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
        <button onClick={login}>Login to Put.io</button>
      </header>
    </div>
  );
}
