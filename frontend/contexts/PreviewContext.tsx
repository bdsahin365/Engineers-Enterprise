import React, { createContext, useContext, useState, ReactNode } from 'react';

interface PreviewContextType {
    isPreview: boolean;
    previewData: any;
    enablePreview: (data: any) => void;
    disablePreview: () => void;
}

const PreviewContext = createContext<PreviewContextType | undefined>(undefined);

export const PreviewProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isPreview, setIsPreview] = useState(false);
    const [previewData, setPreviewData] = useState<any>(null);

    const enablePreview = (data: any) => {
        setIsPreview(true);
        setPreviewData(data);
    };

    const disablePreview = () => {
        setIsPreview(false);
        setPreviewData(null);
    };

    return (
        <PreviewContext.Provider value={{ isPreview, previewData, enablePreview, disablePreview }}>
            {children}
        </PreviewContext.Provider>
    );
};

export const usePreview = () => {
    const context = useContext(PreviewContext);
    if (!context) {
        throw new Error('usePreview must be used within a PreviewProvider');
    }
    return context;
};
