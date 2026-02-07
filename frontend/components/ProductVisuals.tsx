import React from 'react';
import { Eye } from 'lucide-react';
import { Product } from '../types';

interface ProductVisualsProps {
    product: Product;
    activeImage: number;
    setActiveImage: (idx: number) => void;
    viewCount: number;
}

const ProductVisuals: React.FC<ProductVisualsProps> = ({
    product,
    activeImage,
    setActiveImage,
    viewCount
}) => {
    return (
        <div className="space-y-6">
            <div className="aspect-square rounded-[40px] overflow-hidden border border-slate-100 shadow-2xl bg-white group relative">
                <img
                    src={Array.isArray(product.images) ? product.images[activeImage] : 'https://via.placeholder.com/600?text=No+Image'}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                />
                <div className="absolute top-6 left-6 flex flex-col gap-2">
                    <span className="bg-white/90 backdrop-blur px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest text-slate-900 shadow-xl border border-white">
                        {product.modelNo}
                    </span>
                    {product.isPillar && (
                        <span className="bg-blue-600 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-white shadow-xl">
                            Customizable
                        </span>
                    )}
                </div>
                <div className="absolute bottom-6 left-6">
                    <div className="bg-black/60 backdrop-blur-md text-white px-4 py-2 rounded-2xl text-[10px] font-black flex items-center gap-2">
                        <Eye size={14} className="text-blue-400" />
                        {viewCount} জন আজ এটি দেখেছেন
                    </div>
                </div>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-6 no-scrollbar px-1 -mx-1">
                {Array.isArray(product.images) && product.images.map((img, idx) => (
                    <button
                        key={idx}
                        onClick={() => setActiveImage(idx)}
                        className={`w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden border-2 transition-all shrink-0 ${activeImage === idx ? 'border-blue-600 scale-105 shadow-xl ring-4 ring-blue-50' : 'border-slate-100 opacity-60 hover:opacity-100 shadow-sm'
                            }`}
                    >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ProductVisuals;
