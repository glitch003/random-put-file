import React, { useEffect, useState } from "react";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import FolderIcon from "@mui/icons-material/Folder";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";

import { useNavigate, useParams } from "react-router-dom";

import { putioAPI, humanFileSize, getFromPut } from "../utils";
import axios from "axios";

export default function ChooseFolders() {
  const params = useParams();
  const navigate = useNavigate();

  const [items, setItems] = useState(null);
  const [selectedItems, setSelectedItems] = useState(new Set());

  useEffect(() => {
    // console.log("useEffect and currentFolder: ", params.viewingFolderId);
    const go = async () => {
      const token = localStorage.getItem("putioToken");
      putioAPI.setToken(token);
      let url = "https://api.put.io/v2/files/list";
      if (params.viewingFolderId) {
        url += "?parent_id=" + params.viewingFolderId;
      }
      const files = await getFromPut(url, token);
      console.log("files", files);
      setItems(files.data.files);
    };

    go();
  }, [params.viewingFolderId]);

  const handleItemClick = async (item) => {
    console.log("handleItemClick(): ", item);
    if (item.file_type === "FOLDER") {
      navigate("/chooseFolders/" + item.id);
      // const files = await getFilesInFolder(item);
      // setItems(files);
    } else {
      handleCheckboxClick(item);
    }
  };

  const handleCheckboxClick = (item) => {
    console.log("handleCheckboxClick(): ", item);
    const newSelectedItems = new Set(selectedItems);
    if (selectedItems.has(item)) {
      newSelectedItems.delete(item);
    } else {
      newSelectedItems.add(item);
    }
    setSelectedItems(newSelectedItems);
  };

  const getFilesInFolder = async (folder) => {
    const token = localStorage.getItem("putioToken");
    const url = "https://api.put.io/v2/files/list?parent_id=" + folder.id;
    const files = await getFromPut(url, token);
    return files.data.files;
  };

  const getAllFiles = async (filesOrFoldersToSearch) => {
    let filesFound = [];
    for (const fileOrFolder of filesOrFoldersToSearch) {
      if (fileOrFolder.file_type === "FOLDER") {
        const childFiles = await getFilesInFolder(fileOrFolder);
        const childFilesFound = await getAllFiles(childFiles);
        filesFound = [...filesFound, ...childFilesFound];
      } else {
        filesFound.push(fileOrFolder);
      }
    }

    return filesFound.filter((file) => file.file_type === "VIDEO");
  };

  const handlePlay = async () => {
    console.log("handlePlay(): ", selectedItems);
    const allFiles = await getAllFiles(selectedItems);
    console.log("allFiles", allFiles);
    // recursively get all files from selectedItems

    // select a random ID from the selected items
    const randomVideo = allFiles[Math.floor(Math.random() * allFiles.length)];
    console.log("randomVideo", randomVideo);
    const url = `https://app.put.io/files/${randomVideo.id}`;
    window.open(url);
  };

  return (
    <div className="App">
      <div style={{ maxWidth: 800, margin: "auto" }}>
        <List>
          {items ? (
            items.map((item) => (
              <ListItem
                secondaryAction={
                  <Checkbox
                    edge="end"
                    onChange={() => handleCheckboxClick(item)}
                    checked={selectedItems.has(item)}
                  />
                }
              >
                <ListItemIcon
                  onClick={() => handleItemClick(item)}
                  style={{ cursor: "pointer" }}
                >
                  {item.file_type === "FOLDER" ? (
                    <FolderIcon />
                  ) : (
                    <InsertDriveFileIcon />
                  )}
                </ListItemIcon>
                <ListItemText
                  style={{ cursor: "pointer" }}
                  onClick={() => handleItemClick(item)}
                  primary={item.name}
                  secondary={humanFileSize(item.size)}
                />
              </ListItem>
            ))
          ) : (
            <div>Loading...</div>
          )}
        </List>
        <div style={{ height: 36 }} />
        <h3>{selectedItems.size} items selected</h3>
        <button onClick={handlePlay} style={{ fontSize: 36 }}>
          Play
        </button>{" "}
        <button
          onClick={() => setSelectedItems(new Set())}
          style={{ fontSize: 36 }}
        >
          Reset
        </button>
      </div>
      <div style={{ height: 42 }} />
    </div>
  );
}
