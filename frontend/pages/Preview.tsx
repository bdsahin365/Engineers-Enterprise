import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { usePreview } from '../contexts/PreviewContext';
import { api } from '../api';

const Preview: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { enablePreview } = usePreview();

    useEffect(() => {
        const handlePreview = async () => {
            // Get query parameters
            const secret = searchParams.get('secret');
            const url = searchParams.get('url');
            const documentId = searchParams.get('documentId');
            const contentType = searchParams.get('contentType');
            const status = searchParams.get('status');

            // Validate secret
            if (secret !== import.meta.env.VITE_PREVIEW_SECRET) {
                console.error('Invalid preview secret');
                navigate('/');
                return;
            }

            if (!url || !documentId || !contentType) {
                console.error('Missing required preview parameters');
                navigate('/');
                return;
            }

            try {
                // Fetch draft content from Strapi
                // Note: This requires the API to support draft/preview mode
                const draftData = await api.getDraftContent(contentType, documentId);

                // Enable preview mode with the draft data
                enablePreview(draftData);

                // Redirect to the actual page
                navigate(url);
            } catch (error) {
                console.error('Failed to load preview:', error);
                navigate('/');
            }
        };

        handlePreview();
    }, [searchParams, navigate, enablePreview]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-slate-600 font-medium">Loading preview...</p>
            </div>
        </div>
    );
};

export default Preview;
