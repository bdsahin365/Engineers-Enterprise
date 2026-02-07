import React from 'react';
import { X } from 'lucide-react';

interface PreviewBannerProps {
    onExit: () => void;
}

export const PreviewBanner: React.FC<PreviewBannerProps> = ({ onExit }) => {
    return (
        <div className="fixed top-0 left-0 right-0 z-[9999] bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="bg-white/20 px-3 py-1 rounded-full text-sm font-bold uppercase tracking-wider">
                        Preview Mode
                    </div>
                    <p className="text-sm font-medium">
                        You are viewing draft content. Changes are not published yet.
                    </p>
                </div>
                <button
                    onClick={onExit}
                    className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors font-medium text-sm"
                >
                    <X size={16} />
                    Exit Preview
                </button>
            </div>
        </div>
    );
};
