
import React, { useState, useRef } from 'react';
import { Plus, Search, Edit2, Trash2, X, Check, Upload, Image as ImageIcon, Ruler, Box, Settings2, Camera } from 'lucide-react';
import { Product, Category, PillarPart } from '../types';
import AdminLayout from '../components/AdminLayout';

interface Props {
  products: Product[];
  onAddProduct: (product: Product) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
}

export default function AdminProducts({ products, onAddProduct, onUpdateProduct, onDeleteProduct }: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [pillarTab, setPillarTab] = useState<'middle' | 'tops' | 'bottoms'>('middle');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const partFileInputRef = useRef<HTMLInputElement>(null);
  const [activePartId, setActivePartId] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    modelNo: '',
    category: Category.PORCH_PILLAR,
    description: '',
    images: [],
    isPillar: true,
    isVisible: true,
    pillarConfig: {
      tops: [],
      middlePricePerFoot: 400,
      bottoms: []
    }
  });

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.modelNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({ ...product });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        modelNo: 'EE-MOD-' + Math.floor(Math.random() * 1000),
        category: Category.PORCH_PILLAR,
        description: '',
        images: [],
        isPillar: true,
        isVisible: true,
        pillarConfig: {
          tops: [],
          middlePricePerFoot: 400,
          bottoms: []
        }
      });
    }
    setPillarTab('middle');
    setIsModalOpen(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const readers = Array.from(files).map((file: File) => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
      });

      Promise.all(readers).then(base64Images => {
        setFormData(prev => ({
          ...prev,
          images: [...(prev.images || []), ...base64Images]
        }));
      });
    }
  };

  const handlePartImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && activePartId) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const type = pillarTab === 'tops' ? 'tops' : 'bottoms';
        updatePillarPart(type, activePartId, { image: reader.result as string });
        setActivePartId(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images?.filter((_, i) => i !== index)
    }));
  };

  const addPillarPart = (type: 'tops' | 'bottoms') => {
    const newPart: PillarPart = {
      id: Math.random().toString(36).substr(2, 9),
      name: '',
      height: '',
      price: 0,
      image: ''
    };
    
    setFormData(prev => ({
      ...prev,
      pillarConfig: {
        ...prev.pillarConfig!,
        [type]: [...(prev.pillarConfig![type]), newPart]
      }
    }));
  };

  const updatePillarPart = (type: 'tops' | 'bottoms', id: string, updates: Partial<PillarPart>) => {
    setFormData(prev => ({
      ...prev,
      pillarConfig: {
        ...prev.pillarConfig!,
        [type]: prev.pillarConfig![type].map(p => p.id === id ? { ...p, ...updates } : p)
      }
    }));
  };

  const removePillarPart = (type: 'tops' | 'bottoms', id: string) => {
    setFormData(prev => ({
      ...prev,
      pillarConfig: {
        ...prev.pillarConfig!,
        [type]: prev.pillarConfig![type].filter(p => p.id !== id)
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      onUpdateProduct({ ...editingProduct, ...formData } as Product);
    } else {
      onAddProduct({ ...formData, id: 'p' + Date.now() } as Product);
    }
    setIsModalOpen(false);
  };

  const user = { name: 'ম্যানেজার সাহেব', role: 'অ্যাডমিন' };

  return (
    <AdminLayout user={user as any} title="পণ্যসমূহ">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
          <div className="relative flex-grow max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="পণ্য বা মডেল..." 
              className="w-full pl-10 pr-4 py-3 bg-white rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
              value={searchTerm} 
              onChange={e => setSearchTerm(e.target.value)} 
            />
          </div>
          <button 
            onClick={() => openModal()} 
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-black shadow-lg shadow-blue-200 flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            <Plus size={20} /> নতুন পণ্য
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {filteredProducts.map((p) => (
            <div key={p.id} className="bg-white rounded-[32px] overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all group relative">
              <div className="aspect-square bg-slate-50 relative overflow-hidden">
                <img src={p.images[0] || 'https://via.placeholder.com/600?text=No+Image'} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                
                <div className="absolute top-4 left-4">
                  {p.isPillar ? (
                    <span className="bg-blue-600/90 backdrop-blur text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">PILLAR</span>
                  ) : (
                    <span className="bg-slate-900/90 backdrop-blur text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">NORMAL</span>
                  )}
                </div>

                <div className="absolute top-3 right-3 flex flex-col gap-2 translate-x-12 group-hover:translate-x-0 transition-all z-10">
                  <button onClick={() => openModal(p)} className="p-2.5 bg-white text-blue-600 rounded-xl shadow-lg hover:bg-blue-600 hover:text-white transition-colors">
                    <Edit2 size={18} />
                  </button>
                  <button onClick={() => onDeleteProduct(p.id)} className="p-2.5 bg-white text-red-600 rounded-xl shadow-lg hover:bg-red-600 hover:text-white transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">
                    {p.category.split(' ')[0]}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 font-mono tracking-tighter uppercase">{p.modelNo}</span>
                </div>
                <h3 className="font-black text-slate-900 text-sm md:text-base line-clamp-1">{p.name}</h3>
                <p className="text-xl font-black text-slate-900 mt-2">
                  {p.isPillar ? 'বাজেট অনুযায়ী' : `৳${p.price}`}
                </p>
              </div>
            </div>
          ))}
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-0 md:p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
            <div className="bg-white w-full h-full md:h-auto md:rounded-[40px] md:max-w-3xl md:max-h-[90vh] overflow-hidden relative shadow-2xl flex flex-col">
              <div className="px-6 md:px-10 py-6 md:py-8 border-b flex justify-between items-center bg-white z-10">
                <h2 className="text-xl md:text-2xl font-black text-slate-900">
                  {editingProduct ? 'প্রোডাক্ট এডিট করুন' : 'নতুন প্রোডাক্ট'}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 md:p-10 space-y-8 overflow-y-auto flex-grow custom-scrollbar">
                {/* Images Upload */}
                <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                        <ImageIcon size={14} className="text-blue-600" /> প্রোডাক্ট ইমেজ
                    </label>
                    <div className="flex flex-wrap gap-4">
                        {formData.images?.map((img, idx) => (
                            <div key={idx} className="relative w-24 h-24 rounded-2xl overflow-hidden border shadow-sm group">
                                <img src={img} className="w-full h-full object-cover" />
                                <button 
                                    type="button" 
                                    onClick={() => removeImage(idx)} 
                                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X size={12} />
                                </button>
                            </div>
                        ))}
                        <button 
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="w-24 h-24 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-600 transition-all bg-slate-50 hover:bg-blue-50/30"
                        >
                            <Upload size={24} />
                            <span className="text-[10px] font-black mt-1 uppercase">Upload</span>
                        </button>
                        <input type="file" multiple ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">প্রোডাক্টের নাম</label>
                    <input required type="text" className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold outline-none" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="যেমন: প্রিমিয়াম পোরচ পিলার" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">মডেল নম্বর</label>
                    <input required type="text" className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold outline-none" value={formData.modelNo} onChange={(e) => setFormData({...formData, modelNo: e.target.value})} placeholder="যেমন: EE-PP-001" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">ক্যাটাগরি</label>
                        <select className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold outline-none" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value as Category})}>
                            {Object.values(Category).map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <div className="flex items-center gap-4 bg-slate-50 p-5 rounded-2xl">
                        <label className="text-sm font-black text-slate-900 flex items-center gap-2">
                            <Box size={18} className="text-blue-600" /> এটি কি একটি পিলার?
                        </label>
                        <button type="button" onClick={() => setFormData({...formData, isPillar: !formData.isPillar})} className={`w-14 h-8 rounded-full transition-colors relative ${formData.isPillar ? 'bg-blue-600' : 'bg-slate-300'}`}>
                            <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${formData.isPillar ? 'left-7' : 'left-1'}`}></div>
                        </button>
                    </div>
                </div>

                {formData.isPillar ? (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                        <Settings2 className="text-blue-600" />
                        <h3 className="font-black text-slate-900 text-lg uppercase tracking-tight">পিলার কনফিগারেশন</h3>
                    </div>

                    {/* Sub-Tabs Switcher */}
                    <div className="bg-slate-100 p-1.5 rounded-2xl flex gap-1">
                      {[
                        { id: 'middle', label: 'বডি ও দাম', icon: Ruler },
                        { id: 'tops', label: 'টপ অপশন', icon: Box },
                        { id: 'bottoms', label: 'বেস অপশন', icon: Box },
                      ].map((tab) => (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => setPillarTab(tab.id as any)}
                          className={`flex-1 py-3 rounded-xl font-black text-xs md:text-sm flex items-center justify-center gap-2 transition-all ${
                            pillarTab === tab.id ? 'bg-white text-blue-600 shadow-md' : 'text-slate-500 hover:text-slate-700'
                          }`}
                        >
                          <tab.icon size={16} />
                          {tab.label}
                        </button>
                      ))}
                    </div>

                    <div className="p-6 md:p-8 bg-slate-50 rounded-[40px] border border-slate-100 min-h-[350px]">
                      {pillarTab === 'middle' && (
                        <div className="space-y-6 animate-in fade-in duration-300">
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">মাঝের অংশ (Body) - প্রতি রানিং ফুট দর (৳)</label>
                            <div className="relative">
                              <span className="absolute left-5 top-1/2 -translate-y-1/2 font-black text-slate-400">৳</span>
                              <input 
                                type="number" 
                                className="w-full pl-10 pr-5 py-5 bg-white border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-black text-lg outline-none shadow-sm" 
                                value={formData.pillarConfig?.middlePricePerFoot} 
                                onChange={(e) => setFormData({...formData, pillarConfig: {...formData.pillarConfig!, middlePricePerFoot: parseInt(e.target.value)}})} 
                                placeholder="যেমন: ৪০০"
                              />
                            </div>
                            <p className="text-[10px] font-bold text-slate-400 mt-2 flex items-center gap-1 italic">
                              * ইনভয়েস তৈরির সময় এই দামের সাথে ফুটেজ গুণ করা হবে।
                            </p>
                          </div>
                          
                          <div className="p-6 bg-blue-50 rounded-3xl border border-blue-100 flex items-start gap-4">
                            <div className="bg-blue-600 text-white p-2.5 rounded-xl shadow-lg shadow-blue-200 shrink-0"><Check size={18} /></div>
                            <p className="text-xs md:text-sm font-black text-blue-900 leading-relaxed">বডি অংশ কাস্টম উচ্চতায় তৈরি করা সম্ভব। গ্রাহকের প্রয়োজন অনুযায়ী ইনভয়েসে রানিং ফুট সিলেক্ট করা যাবে।</p>
                          </div>
                        </div>
                      )}

                      {(pillarTab === 'tops' || pillarTab === 'bottoms') && (
                        <div className="space-y-4 animate-in fade-in duration-300">
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">{pillarTab === 'tops' ? 'টপ অংশসমূহ' : 'বেস অংশসমূহ'}</h4>
                            <button type="button" onClick={() => addPillarPart(pillarTab)} className="text-[10px] font-black bg-blue-600 text-white px-5 py-2.5 rounded-2xl flex items-center gap-1.5 shadow-xl shadow-blue-200 active:scale-95 transition-all">
                              <Plus size={14} /> নতুন অংশ
                            </button>
                          </div>
                          
                          <div className="space-y-4">
                            {(formData.pillarConfig?.[pillarTab] || []).map((part) => (
                              <div key={part.id} className="grid grid-cols-1 sm:grid-cols-12 gap-4 bg-white p-5 rounded-3xl border border-slate-100 items-start shadow-sm hover:border-blue-200 transition-colors group/item">
                                <div className="sm:col-span-3 flex flex-col items-center">
                                  <div className="relative w-full aspect-square bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 group/part">
                                    {part.image ? (
                                      <>
                                        <img src={part.image} className="w-full h-full object-cover" />
                                        <button 
                                          type="button" 
                                          onClick={() => updatePillarPart(pillarTab, part.id, { image: '' })}
                                          className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover/part:opacity-100 transition-opacity"
                                        >
                                          <X size={10} />
                                        </button>
                                      </>
                                    ) : (
                                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 bg-slate-50">
                                        <Camera size={24} />
                                        <span className="text-[8px] font-black uppercase mt-1">No Image</span>
                                      </div>
                                    )}
                                    <button 
                                      type="button" 
                                      onClick={() => { setActivePartId(part.id); partFileInputRef.current?.click(); }}
                                      className="absolute inset-0 bg-slate-900/40 text-white opacity-0 group-hover/part:opacity-100 transition-opacity flex flex-col items-center justify-center"
                                    >
                                      <Camera size={20} />
                                      <span className="text-[8px] font-black uppercase mt-1">{part.image ? 'Change' : 'Upload'}</span>
                                    </button>
                                  </div>
                                </div>
                                <div className="sm:col-span-4 space-y-1.5">
                                  <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">নাম</label>
                                  <input placeholder="যেমন: ক্লাসিক রাউন্ড" className="w-full p-3 bg-slate-50 rounded-xl text-xs font-black border-none outline-none focus:ring-1 focus:ring-blue-500" value={part.name} onChange={e => updatePillarPart(pillarTab, part.id, { name: e.target.value })} />
                                </div>
                                <div className="sm:col-span-2 space-y-1.5">
                                  <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">মাপ</label>
                                  <input placeholder="১.৫ ফুট" className="w-full p-3 bg-slate-50 rounded-xl text-xs font-black border-none outline-none focus:ring-1 focus:ring-blue-500" value={part.height} onChange={e => updatePillarPart(pillarTab, part.id, { height: e.target.value })} />
                                </div>
                                <div className="sm:col-span-2 space-y-1.5">
                                  <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">দর (৳)</label>
                                  <input type="number" placeholder="১৫০০" className="w-full p-3 bg-slate-50 rounded-xl text-xs font-black border-none outline-none focus:ring-1 focus:ring-blue-500" value={part.price} onChange={e => updatePillarPart(pillarTab, part.id, { price: parseInt(e.target.value) })} />
                                </div>
                                <div className="sm:col-span-1 flex items-center justify-center pt-6">
                                  <button type="button" onClick={() => removePillarPart(pillarTab, part.id)} className="p-3 text-red-500 hover:bg-red-50 rounded-2xl transition-all">
                                    <Trash2 size={20} />
                                  </button>
                                </div>
                              </div>
                            ))}
                            {(!formData.pillarConfig?.[pillarTab] || formData.pillarConfig?.[pillarTab].length === 0) && (
                              <div className="flex flex-col items-center justify-center py-16 text-slate-300">
                                <Box size={48} strokeWidth={1} className="mb-4 opacity-20" />
                                <p className="text-[10px] font-black uppercase tracking-[0.2em]">কোন অপশন যোগ করা হয়নি</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                    {/* Hidden input for part images */}
                    <input type="file" ref={partFileInputRef} className="hidden" accept="image/*" onChange={handlePartImageUpload} />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">প্রোডাক্টের দর (৳)</label>
                    <div className="relative">
                      <span className="absolute left-5 top-1/2 -translate-y-1/2 font-black text-slate-400 text-lg">৳</span>
                      <input 
                        type="number" 
                        className="w-full pl-10 pr-5 py-5 bg-slate-50 border-none rounded-[24px] focus:ring-2 focus:ring-blue-500 font-black text-lg outline-none" 
                        value={formData.price} 
                        onChange={(e) => setFormData({...formData, price: parseInt(e.target.value)})} 
                        placeholder="যেমন: ৫০০" 
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">বিস্তারিত বিবরণ</label>
                  <textarea rows={3} className="w-full px-5 py-5 bg-slate-50 border-none rounded-[24px] focus:ring-2 focus:ring-blue-500 font-black outline-none leading-relaxed" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} placeholder="পণ্য সম্পর্কে বিস্তারিত লিখুন..." />
                </div>

                <div className="pt-4">
                  <button type="submit" className="w-full bg-slate-900 text-white py-6 rounded-[32px] font-black text-lg shadow-2xl shadow-slate-200 hover:bg-slate-800 transition-all active:scale-95 flex items-center justify-center gap-2">
                    <Check size={28} /> প্রোডাক্ট {editingProduct ? 'আপডেট' : 'সেভ'} করুন
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
