import React, { useState } from 'react';
import axios from '../api/axios';

const ImageUploadForm = ({ albumId, onImageUploaded }) => {
    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('file', file);
        formData.append('album', albumId);

        try {
            const response = await axios.post('images/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            onImageUploaded(response.data); // Notify parent about the new image
            setFile(null);
        } catch (error) {
            console.error('Error uploading image:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h3>Upload Image</h3>
            <input type="file" onChange={handleFileChange} required />
            <button type="submit">Upload</button>
        </form>
    );
};

export default ImageUploadForm;
