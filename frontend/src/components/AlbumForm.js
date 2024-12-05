import React, { useState, useEffect } from 'react';
import axios from '../api/axios';

const AlbumForm = ({ albumToEdit, onAlbumSaved }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        if (albumToEdit) {
            setName(albumToEdit.name);
            setDescription(albumToEdit.description);
        } else {
            setName('');
            setDescription('');
        }
    }, [albumToEdit]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (albumToEdit) {
                // Update existing album
                const response = await axios.put(`albums/${albumToEdit.id}/`, {
                    name,
                    description,
                });
                onAlbumSaved(response.data);
            } else {
                // Create new album
                const response = await axios.post('albums/', { name, description });
                onAlbumSaved(response.data);
            }
            setName('');
            setDescription('');
        } catch (error) {
            console.error('Error saving album:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>{albumToEdit ? 'Edit Album' : 'Create Album'}</h2>
            <label>
                Name:
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </label>
            <br />
            <label>
                Description:
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                ></textarea>
            </label>
            <br />
            <button type="submit">{albumToEdit ? 'Update' : 'Create'}</button>
        </form>
    );
};

export default AlbumForm;
