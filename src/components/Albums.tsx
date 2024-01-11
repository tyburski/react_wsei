import React, { useState, useEffect } from "react";
import axios from "axios";
import "./style.css";

interface Album {
  userId: number;
  id: number;
  title: string;
}

interface AlbumsProps {
  onAlbumSelected: (albumId: number, albumTitle: string) => void;
}

const Albums: React.FC<AlbumsProps> = ({ onAlbumSelected }) => {
  const [albums, setAlbums] = useState<Album[]>([]);
  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const response = await axios.get<Album[]>(
          "https://jsonplaceholder.typicode.com/albums"
        );
        setAlbums(response.data);
      } catch (error) {
        console.error("", error);
      }
    };

    fetchAlbums();
  }, []);

  const handleAlbumClick = (album: Album) => {
    onAlbumSelected(album.id, album.title);
  };

  return (
    <div className="albums">
      <h2>ALBUMY</h2>

      <div className="album-grid">
        {albums.map((album) => (
          <div
            key={album.id}
            className="album-item"
            onClick={() => handleAlbumClick(album)}
            style={{ backgroundColor: getRandomColor() }}
          >
            {album.title.toUpperCase()}
          </div>
        ))}
      </div>
    </div>
  );
};

const getRandomColor = () => {
  return "#" + Math.floor(Math.random() * 16777215).toString(16);
};

export default Albums;
