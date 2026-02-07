import React, { useRef, useState } from 'react';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';
import { api } from '../../api';
import { toast } from 'sonner';

interface ImageUploaderProps {
    value?: string;
    onChange: (url: string) => void;
    label?: string;
    className?: string;
    aspectRatio?: 'square' | 'video' | 'auto';
    helperText?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
    value,
    onChange,
    label = "Upload Image",
    className = "",
    aspectRatio = 'video',
    helperText
}) => {
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate type
        if (!file.type.startsWith('image/')) {
            toast.error('Please upload an image file');
            return;
        }

        // Validate size (e.g., 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error('File size should be less than 5MB');
            return;
        }

        try {
            setUploading(true);
            const url = await api.uploadFile(file);
            onChange(url);
            toast.success('Image uploaded successfully');
        } catch (error) {
            console.error(error);
            toast.error('Failed to upload image');
        } finally {
            setUploading(false);
            // Reset input so same file can be selected again if needed
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const clearImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange('');
    };

    const aspectRatioClass = {
        square: 'aspect-square',
        video: 'aspect-video',
        auto: 'aspect-auto'
    }[aspectRatio];

    return (
        <div className={`space-y-2 ${className}`}>
            {label && (
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                    <ImageIcon size={14} className="text-blue-500" /> {label}
                </label>
            )}

            <div
                onClick={() => !uploading && fileInputRef.current?.click()}
                className={`relative w-full ${aspectRatioClass} bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl overflow-hidden cursor-pointer group hover:border-blue-500 hover:bg-blue-50/10 transition-all ${uploading ? 'pointer-events-none opacity-70' : ''}`}
            >
                {value ? (
                    <>
                        <img src={value} alt="Uploaded" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <p className="text-white font-bold text-xs flex items-center gap-2">
                                <Upload size={16} /> Change Image
                            </p>
                        </div>
                        <button
                            onClick={clearImage}
                            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-md"
                        >
                            <X size={14} />
                        </button>
                    </>
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 p-6">
                        {uploading ? (
                            <>
                                <Loader2 size={32} className="animate-spin text-blue-600 mb-2" />
                                <span className="text-xs font-bold text-blue-600">Uploading...</span>
                            </>
                        ) : (
                            <>
                                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                                    <Upload size={24} />
                                </div>
                                <span className="text-xs font-black uppercase tracking-widest group-hover:text-blue-600 transition-colors">Click to Upload</span>
                                {helperText && <span className="text-[10px] font-medium mt-1 opacity-70">{helperText}</span>}
                            </>
                        )}
                    </div>
                )}
            </div>

            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/png, image/jpeg, image/jpg, image/webp"
            />
        </div>
    );
};

export default ImageUploader;
