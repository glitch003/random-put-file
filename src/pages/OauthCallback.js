import React, { useEffect } from "react";
import { putioAPI } from "../utils";
import { useNavigate } from "react-router-dom";

export default function OauthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.substring(1));
    const token = params.get("access_token");
    localStorage.setItem("putioToken", token);
    navigate("/chooseFolders");
  }, []);

  return (
    <div className="App">
      <header className="App-header">Success!</header>
    </div>
  );
}
