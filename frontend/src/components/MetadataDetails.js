import React, { useState, useEffect } from 'react';
import axios from '../api/axios';

const MetadataDetails = ({ imageId }) => {
    const [metadata, setMetadata] = useState(null);

    useEffect(() => {
        const fetchMetadata = async () => {
            try {
                const response = await axios.get(`metadata/?image=${imageId}`);
                setMetadata(response.data);
            } catch (error) {
                console.error('Error fetching metadata:', error);
            }
        };

        if (imageId) {
            fetchMetadata();
        }
    }, [imageId]);

    return metadata ? (
        <div>
            <h4>Metadata</h4>
            <p><strong>People:</strong> {metadata.people}</p>
            <p><strong>Location:</strong> {metadata.location}</p>
            <p><strong>Date Taken:</strong> {metadata.date_taken}</p>
            <p><strong>Notes:</strong> {metadata.notes}</p>
        </div>
    ) : (
        <p>No metadata available.</p>
    );
};

export default MetadataDetails;
