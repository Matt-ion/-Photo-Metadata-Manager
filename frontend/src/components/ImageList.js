import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import MetadataDetails from './MetadataDetails';
import ImageUploadForm from './ImageUploadForm';

const ImageList = ({ albumId }) => {
    const [images, setImages] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const response = await axios.get(`images/?album=${albumId}`);
                setImages(response.data);
            } catch (error) {
                console.error('Error fetching images:', error);
            }
        };

        if (albumId) {
            fetchImages();
        }
    }, [albumId]);

    const handleImageUploaded = (newImage) => {
        setImages((prevImages) => [...prevImages, newImage]);
    };

    return (
        <div>
            <h3>Images</h3>
            <ImageUploadForm albumId={albumId} onImageUploaded={handleImageUploaded} />
            <ul>
                {images.map((image) => (
                    <li key={image.id}>
                        <img
                            src={`${image.file}`} // This must match the image URL that works in the browser
                            alt="Album Image"
                            style={{ width: '200px', height: 'auto', marginBottom: '10px' }}
                            onClick={() => setSelectedImage(image)}
                        />
                    </li>
                ))}
            </ul>
            {selectedImage && (
                <MetadataDetails imageId={selectedImage.id} />
            )}
        </div>
    );
};

export default ImageList;
