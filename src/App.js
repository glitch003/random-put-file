import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import OauthCallback from "./pages/OauthCallback";
import ChooseFolders from "./pages/ChooseFolders";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/oauth/callback" element={<OauthCallback />} />
        <Route path="/chooseFolders" element={<ChooseFolders />}>
          <Route path=":viewingFolderId" element={<ChooseFolders />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
