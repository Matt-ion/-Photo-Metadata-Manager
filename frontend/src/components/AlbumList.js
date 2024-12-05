import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import AlbumForm from './AlbumForm';
import ImageList from './ImageList';

const AlbumList = () => {
    const [albums, setAlbums] = useState([]);
    const [albumToEdit, setAlbumToEdit] = useState(null);
    const [selectedAlbumId, setSelectedAlbumId] = useState(null);
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [showConfirmDeleteImagesPopup, setShowConfirmDeleteImagesPopup] = useState(false);
    const [deleteWithImages, setDeleteWithImages] = useState(false);
    const [albumToDelete, setAlbumToDelete] = useState(null);

    useEffect(() => {
        const fetchAlbums = async () => {
            try {
                const response = await axios.get('albums/');
                setAlbums(response.data);
            } catch (error) {
                console.error('Error fetching albums:', error);
            }
        };

        fetchAlbums();
    }, []);

    const handleAlbumSaved = (savedAlbum) => {
        if (albumToEdit) {
            setAlbums((prevAlbums) =>
                prevAlbums.map((album) =>
                    album.id === savedAlbum.id ? savedAlbum : album
                )
            );
        } else {
            setAlbums((prevAlbums) => [...prevAlbums, savedAlbum]);
        }
        setAlbumToEdit(null);
    };

    const confirmDeleteAlbum = (id) => {
        setAlbumToDelete(id);
        setShowDeletePopup(true);
    };

    const handleDeleteWithImages = () => {
        setDeleteWithImages(true); // Ensure we flag that images should be deleted
        setShowDeletePopup(false);
        setShowConfirmDeleteImagesPopup(true); // Show confirmation popup
    };

    const deleteAlbum = async () => {
        try {
            const url = deleteWithImages
                ? `albums/${albumToDelete}/?delete_images=true`
                : `albums/${albumToDelete}/`;
            
            // Delete album via API
            await axios.delete(url);

            // Remove album from UI
            setAlbums((prevAlbums) =>
                prevAlbums.filter((album) => album.id !== albumToDelete)
            );
        } catch (error) {
            console.error('Error deleting album:', error);
        } finally {
            // Reset states
            setShowDeletePopup(false);
            setShowConfirmDeleteImagesPopup(false);
            setAlbumToDelete(null);
            setDeleteWithImages(false);
        }
    };

    return (
        <div className="container">
            <h1>Album List</h1>
            <AlbumForm albumToEdit={albumToEdit} onAlbumSaved={handleAlbumSaved} />
            <ul>
                {albums.map((album) => (
                    <li key={album.id}>
                        <strong>{album.name}</strong>
                        <p>{album.description}</p>
                        <button onClick={() => setAlbumToEdit(album)}>Edit</button>
                        <button onClick={() => confirmDeleteAlbum(album.id)}>Delete</button>
                        <button onClick={() => setSelectedAlbumId(album.id)}>
                            View Images
                        </button>
                    </li>
                ))}
            </ul>
            {selectedAlbumId && <ImageList albumId={selectedAlbumId} />}

            {/* Delete Album Popup */}
            {showDeletePopup && (
                <div className="popup">
                    <h3>Delete Album</h3>
                    <p>
                        Do you want to delete this album along with all its associated images?
                    </p>
                    <button onClick={handleDeleteWithImages}>
                        Yes, delete album and images
                    </button>
                    <button
                        onClick={() => {
                            setDeleteWithImages(false);
                            deleteAlbum(); // Delete album without images
                        }}
                    >
                        No, keep images
                    </button>
                    <button onClick={() => setShowDeletePopup(false)}>Cancel</button>
                </div>
            )}

            {/* Confirm Delete Images Popup */}
            {showConfirmDeleteImagesPopup && (
                <div className="popup">
                    <h3>Are you sure?</h3>
                    <p>
                        Deleting the album will also delete all its associated photos. This action
                        cannot be undone. Are you sure you want to proceed?
                    </p>
                    <button
                        onClick={() => {
                            deleteAlbum(); // Confirm deletion
                        }}
                    >
                        Yes, delete everything
                    </button>
                    <button
                        onClick={() => {
                            setShowConfirmDeleteImagesPopup(false);
                            setAlbumToDelete(null);
                            setDeleteWithImages(false);
                        }}
                    >
                        Cancel
                    </button>
                </div>
            )}
        </div>
    );
};

export default AlbumList;
