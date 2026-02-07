import React, { useState } from 'react';
import { Ruler, CheckCircle2, CornerDownRight, Maximize2, X } from 'lucide-react';
import { Product, PillarPart } from '../types';

interface PillarCustomizerProps {
    product: Product;
    runningFeet: number;
    setRunningFeet: (val: number) => void;
    selectedTopId: string;
    setSelectedTopId: (val: string) => void;
    selectedBottomId: string;
    setSelectedBottomId: (val: string) => void;
    calculateTotalPrice: () => number;
}

const PartCard: React.FC<{
    part: PillarPart,
    isSelected: boolean,
    onSelect: () => void,
    onPreview: (part: PillarPart) => void
}> = ({ part, isSelected, onSelect, onPreview }) => (
    <div
        className={`group relative rounded-2xl border transition-all overflow-hidden flex flex-col ${isSelected ? 'border-blue-600 bg-blue-50/50 shadow-md scale-[1.02]' : 'border-slate-100 bg-white hover:border-blue-200 hover:shadow-sm'
            }`}
    >
        <div className="relative aspect-square overflow-hidden bg-slate-100">
            <img
                src={part.image || 'https://via.placeholder.com/300'}
                alt={part.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <button
                onClick={(e) => { e.stopPropagation(); onPreview(part); }}
                className="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur rounded-lg text-slate-500 hover:text-blue-600 hover:scale-110 transition-all shadow-sm opacity-0 group-hover:opacity-100"
            >
                <Maximize2 size={14} />
            </button>
            {isSelected && (
                <div className="absolute top-2 left-2 bg-blue-600 text-white p-1 rounded-lg shadow-lg animate-in zoom-in duration-300">
                    <CheckCircle2 size={14} fill="currentColor" className="text-white" />
                </div>
            )}
        </div>
        <button
            onClick={onSelect}
            className="p-2.5 text-left flex-grow flex flex-col justify-center"
        >
            <h5 className="font-black text-slate-900 text-[10px] leading-tight truncate">{part.name}</h5>
            <div className="flex items-center justify-between mt-1">
                <span className="text-[11px] font-black text-blue-600">৳{part.price.toLocaleString()}</span>
                <span className="text-[8px] font-bold text-slate-400 uppercase">{part.height}</span>
            </div>
        </button>
    </div>
);

const PillarCustomizer: React.FC<PillarCustomizerProps> = ({
    product,
    runningFeet,
    setRunningFeet,
    selectedTopId,
    setSelectedTopId,
    selectedBottomId,
    setSelectedBottomId,
    calculateTotalPrice
}) => {
    const [previewPart, setPreviewPart] = useState<PillarPart | null>(null);

    if (!product.pillarConfig) return null;

    const selectedTop = product.pillarConfig?.tops.find(t => t.id === selectedTopId);
    const selectedBottom = product.pillarConfig?.bottoms.find(b => b.id === selectedBottomId);

    return (
        <div className="bg-white rounded-[40px] shadow-2xl shadow-blue-900/5 border border-slate-100 overflow-hidden mb-10">
            <div className="bg-slate-900 p-6 md:p-8 text-white flex justify-between items-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 blur-3xl rounded-full translate-x-16 -translate-y-16"></div>
                <h3 className="text-xl font-black flex items-center gap-3 uppercase tracking-tight relative z-10">
                    <Ruler size={24} className="text-blue-400" /> কাস্টমাইজেশন
                </h3>
                <div className="bg-blue-600 px-4 py-1.5 rounded-full text-[10px] font-black shadow-lg relative z-10">PREMIUM CONFIGURATOR</div>
            </div>

            <div className="p-6 md:p-8 space-y-10">
                {/* Top Part Selection */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3 text-slate-900">
                        <div className="w-2 h-8 bg-blue-600 rounded-full"></div>
                        <div>
                            <h4 className="font-black text-lg uppercase tracking-tight leading-none">১. টপ ডিজাইন নির্বাচন করুন</h4>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">পিলারের উপরে যে ডিজাইনটি থাকবে</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
                        {product.pillarConfig.tops.map(top => (
                            <PartCard
                                key={top.id}
                                part={top}
                                isSelected={selectedTopId === top.id}
                                onSelect={() => setSelectedTopId(top.id)}
                                onPreview={setPreviewPart}
                            />
                        ))}
                    </div>
                </div>

                {/* Bottom Part Selection */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3 text-slate-900">
                        <div className="w-2 h-8 bg-blue-600 rounded-full"></div>
                        <div>
                            <h4 className="font-black text-lg uppercase tracking-tight leading-none">২. বেস ডিজাইন নির্বাচন করুন</h4>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">পিলারের গোড়ায় যে ডিজাইনটি থাকবে</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
                        {product.pillarConfig.bottoms.map(bottom => (
                            <PartCard
                                key={bottom.id}
                                part={bottom}
                                isSelected={selectedBottomId === bottom.id}
                                onSelect={() => setSelectedBottomId(bottom.id)}
                                onPreview={setPreviewPart}
                            />
                        ))}
                    </div>
                </div>

                {/* Running Feet Slider */}
                <div className="space-y-8 pt-8 border-t border-slate-100">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                        <div>
                            <h4 className="font-black text-lg uppercase tracking-tight text-slate-900 leading-none mb-2">৩. বডি রানিং ফুট</h4>
                            <p className="text-xs font-bold text-slate-400 flex items-center gap-2">
                                <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">৳{product.pillarConfig.middlePricePerFoot} / ফুট</span>
                                পিলারের মাঝের অংশের উচ্চতা নির্ধারণ করুন
                            </p>
                        </div>
                        <div className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-black text-xl shadow-xl flex items-baseline gap-1">
                            {runningFeet} <span className="text-[10px] uppercase text-blue-400">Feet</span>
                        </div>
                    </div>
                    <div className="relative h-10 flex items-center group/slider">
                        <div className="absolute inset-0 bg-slate-100 rounded-full h-3 my-auto"></div>
                        <div
                            className="absolute left-0 bg-blue-600 rounded-full h-3 my-auto transition-all"
                            style={{ width: `${(runningFeet / 40) * 100}%` }}
                        ></div>
                        <input
                            type="range"
                            min="1"
                            max="40"
                            value={runningFeet}
                            onChange={(e) => setRunningFeet(parseInt(e.target.value))}
                            className="w-full h-full relative z-10 opacity-0 cursor-pointer"
                        />
                        <div
                            className="absolute w-8 h-8 bg-white border-4 border-blue-600 rounded-full shadow-xl pointer-events-none transition-all"
                            style={{ left: `calc(${(runningFeet / 40) * 100}% - 16px)` }}
                        ></div>
                    </div>
                    <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        <span>১ ফুট</span>
                        <span>২০ ফুট</span>
                        <span>৪০ ফুট</span>
                    </div>
                </div>

                {/* Summary Box */}
                <div className="bg-blue-600 rounded-[40px] p-8 md:p-12 text-white shadow-2xl relative overflow-hidden group">
                    <div className="absolute -right-12 -top-12 opacity-10 group-hover:scale-125 transition-transform duration-1000 rotate-12"><Ruler size={200} /></div>
                    <div className="absolute -left-12 -bottom-12 opacity-5 group-hover:scale-110 transition-transform duration-1000"><CheckCircle2 size={180} /></div>

                    <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-10">
                        <div className="text-center lg:text-left">
                            <p className="text-xs font-black uppercase text-blue-200 tracking-[0.3em] mb-3">সর্বমোট আনুমানিক মূল্য</p>
                            <p className="text-6xl md:text-7xl font-black text-white leading-none tracking-tighter">৳{calculateTotalPrice().toLocaleString()}</p>
                        </div>

                        <div className="hidden lg:block w-px h-24 bg-white/20"></div>

                        <div className="space-y-3 w-full lg:w-auto">
                            {[
                                { label: selectedTop?.name || 'টপ ডিজাইন', price: selectedTop?.price || 0 },
                                { label: `${runningFeet} ফুট বডি (৳${product.pillarConfig.middlePricePerFoot}/ft)`, price: product.pillarConfig.middlePricePerFoot * runningFeet },
                                { label: selectedBottom?.name || 'বেস ডিজাইন', price: selectedBottom?.price || 0 }
                            ].map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center gap-8 text-xs font-bold text-blue-100/80 uppercase tracking-widest">
                                    <span className="flex items-center gap-2"><CornerDownRight size={14} className="text-blue-300" /> {item.label}</span>
                                    <span className="text-white font-black">৳{item.price.toLocaleString()}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Preview Modal */}
            {previewPart && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-300">
                    <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-xl" onClick={() => setPreviewPart(null)}></div>
                    <div className="relative bg-white rounded-[40px] overflow-hidden max-w-4xl w-full max-h-full shadow-2xl animate-in zoom-in-95 duration-300">
                        <button
                            onClick={() => setPreviewPart(null)}
                            className="absolute top-6 right-6 p-3 bg-slate-900/10 hover:bg-slate-900/20 text-slate-900 rounded-2xl transition-all z-10"
                        >
                            <X size={24} />
                        </button>

                        <div className="flex flex-col md:flex-row h-full">
                            <div className="w-full md:w-2/3 aspect-square md:aspect-auto">
                                <img
                                    src={previewPart.image || 'https://via.placeholder.com/600'}
                                    alt={previewPart.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="p-10 flex flex-col justify-between">
                                <div>
                                    <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 inline-block">DESIGN PREVIEW</span>
                                    <h4 className="text-4xl font-black text-slate-900 mb-2 leading-tight">{previewPart.name}</h4>
                                    <p className="text-slate-500 font-bold text-lg mb-8">{previewPart.height} High Precision Casting</p>

                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                                            <p className="text-sm font-bold text-slate-600 leading-relaxed italic">"আধুনিক বাড়ি ও বাণিজ্যিক ভবনের সৌন্দর্য বৃদ্ধিতে এই ডিজাইনটি আমাদের অন্যতম সেরা কালেকশন।"</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-12">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">এস্টিমেটেড প্রাইজ</p>
                                    <p className="text-5xl font-black text-blue-600">৳{previewPart.price.toLocaleString()}</p>
                                    <button
                                        onClick={() => {
                                            if (product.pillarConfig?.tops.find(t => t.id === previewPart.id)) setSelectedTopId(previewPart.id);
                                            else setSelectedBottomId(previewPart.id);
                                            setPreviewPart(null);
                                        }}
                                        className="w-full bg-slate-900 text-white rounded-2xl py-5 mt-8 font-black hover:bg-blue-600 transition-all shadow-xl active:scale-95"
                                    >
                                        এই ডিজাইনটি নির্বাচন করুন
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PillarCustomizer;
