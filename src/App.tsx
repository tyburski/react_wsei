import React, { useState } from "react";
import "./components/style.css";
import Header from "./components/Header";
import Photos from "./components/Photos";
import Albums from "./components/Albums";
import Posts from "./components/Posts";
import Users from "./components/Users";
import Settings from "./components/Settings";

function App() {
  const [viewMode, setViewMode] = useState<
    "photos" | "albums" | "posts" | "users" | "settings"
  >("posts");
  const [selectedAlbumId, setSelectedAlbumId] = useState<number | null>(null);
  const [selectedAlbumTitle, setSelectedAlbumTitle] = useState<string>("");

  const handleViewChange = (
    mode: "photos" | "albums" | "posts" | "users" | "settings"
  ) => {
    setViewMode(mode);
    setSelectedAlbumId(null);
    setSelectedAlbumTitle("");
  };

  const handleAlbumSelected = (albumId: number, albumTitle: string) => {
    setSelectedAlbumId(albumId);
    setSelectedAlbumTitle(albumTitle);
    setViewMode("photos");
  };

  return (
    <div className="App">
      <Header onViewChange={handleViewChange} />
      {viewMode === "albums" && (
        <Albums onAlbumSelected={handleAlbumSelected} />
      )}
      {viewMode === "photos" && (
        <Photos
          selectedAlbumId={selectedAlbumId}
          selectedAlbumTitle={selectedAlbumTitle}
        />
      )}
      {viewMode === "posts" && <Posts />}
      {viewMode === "users" && <Users />}
      {viewMode === "settings" && <Settings />}
    </div>
  );
}

export default App;
