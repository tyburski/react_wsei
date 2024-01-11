import React, { useEffect, useState } from "react";
import axios from "axios";
import "./style.css";

interface Photo {
  albumId: number;
  id: number;
  title: string;
  url: string;
  thumbnailUrl: string;
}

interface PhotosProps {
  selectedAlbumId: number | null;
  selectedAlbumTitle: string;
}

const Photos: React.FC<PhotosProps> = ({
  selectedAlbumId,
  selectedAlbumTitle,
}) => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const pageSize = 20;
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [lightboxOpen, setLightboxOpen] = useState<boolean>(false);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        let response;

        if (selectedAlbumId !== null) {
          response = await axios.get<Photo[]>(
            "https://jsonplaceholder.typicode.com/photos",
            { params: { albumId: selectedAlbumId } }
          );
        } else {
          response = await axios.get<Photo[]>(
            "https://jsonplaceholder.typicode.com/photos"
          );
        }

        setPhotos(response.data);
      } catch (error) {
        console.error("", error);
      }
    };
    fetchPhotos();
  }, [selectedAlbumId]);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  const currentPhotos = photos.slice(startIndex, endIndex);

  const pageCount = Math.ceil(photos.length / pageSize);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < pageCount) {
      handlePageChange(currentPage + 1);
    }
  };

  const handleOpenLightbox = async (photo: Photo) => {
    setSelectedPhoto(photo);
    setLightboxOpen(true);
  };

  return (
    <div className="photos">
      <h2>
        {selectedAlbumTitle
          ? selectedAlbumTitle.toUpperCase()
          : "WSZYSTKIE ZDJĘCIA"}
      </h2>
      <div className="photo-grid">
        {currentPhotos.map((photo) => (
          <div
            key={photo.id}
            className="photo-item"
            onClick={() => handleOpenLightbox(photo)}
          >
            <img src={photo.thumbnailUrl} alt={photo.title} />
          </div>
        ))}
      </div>
      {lightboxOpen && (
        <div
          className="lightbox-overlay"
          onClick={() => setLightboxOpen(false)}
        >
          <div className="lightbox-content">
            <img
              src={selectedPhoto?.url}
              alt={selectedPhoto?.title}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
      <div className="pagination">
        <p>
          Strona {currentPage} z {pageCount}
        </p>
        <button onClick={handlePrevPage} disabled={currentPage === 1}>
          ⭠
        </button>
        <button onClick={handleNextPage} disabled={currentPage === pageCount}>
          ⭢
        </button>
      </div>
    </div>
  );
};

export default Photos;
