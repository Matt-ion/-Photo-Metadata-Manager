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
        setShowDeletePopup(false);
        setShowConfirmDeleteImagesPopup(true); // Trigger the second confirmation popup
    };

    const deleteAlbum = async () => {
        try {
            if (deleteWithImages) {
                // Include the delete_images=true parameter
                await axios.delete(`albums/${albumToDelete}/?delete_images=true`);
            } else {
                // Delete album only
                await axios.delete(`albums/${albumToDelete}/`);
            }

            // Remove album from the UI
            setAlbums((prevAlbums) =>
                prevAlbums.filter((album) => album.id !== albumToDelete)
            );
        } catch (error) {
            console.error('Error deleting album:', error);
        } finally {
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
                            deleteAlbum();
                        }}
                    >
                        No, keep images
                    </button>
                    <button onClick={() => setShowDeletePopup(false)}>Cancel</button>
                </div>
            )}

            {showConfirmDeleteImagesPopup && (
                <div className="popup">
                    <h3>Are you sure?</h3>
                    <p>
                        Deleting the album will also delete all its associated photos. This action
                        cannot be undone. Are you sure you want to proceed?
                    </p>
                    <button
                        onClick={() => {
                            setDeleteWithImages(true);
                            deleteAlbum();
                        }}
                    >
                        Yes, delete everything
                    </button>
                    <button
                        onClick={() => {
                            setShowConfirmDeleteImagesPopup(false);
                            setAlbumToDelete(null);
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
