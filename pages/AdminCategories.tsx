import React, { useState, useEffect, useRef } from 'react';
import { Plus, Search, Edit2, Trash2, X, Check, Upload, Image as ImageIcon, Layout } from 'lucide-react';
import ImageUploader from '../components/ui/ImageUploader';
import { CategoryItem } from '../types';
import AdminLayout from '../components/AdminLayout';
import { api } from '../api';

export default function AdminCategories() {
    const [categories, setCategories] = useState<CategoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState<Partial<CategoryItem>>({
        name: '',
        slug: '',
        description: '',
        icon: 'Layout',
        image: ''
    });

    const fetchCategories = async () => {
        try {
            const data = await api.getCategories();
            setCategories(data);
        } catch (error) {
            console.error("Failed to fetch categories", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, image: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingCategory) {
                await api.updateCategory(editingCategory.id, formData);
            } else {
                await api.createCategory(formData);
            }
            fetchCategories();
            setIsModalOpen(false);
        } catch (error) {
            console.error("Failed to save category", error);
            alert("Failed to save category");
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this category?")) {
            try {
                await api.deleteCategory(id);
                fetchCategories();
            } catch (error) {
                console.error("Failed to delete category", error);
            }
        }
    };

    const openModal = (category?: CategoryItem) => {
        if (category) {
            setEditingCategory(category);
            setFormData({ ...category });
        } else {
            setEditingCategory(null);
            setFormData({
                name: '',
                slug: '',
                description: '',
                icon: 'Layout',
                image: ''
            });
        }
        setIsModalOpen(true);
    };

    const filteredCategories = categories.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.slug.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const user = { name: 'Admin', role: 'Administrator' }; // Mock user for layout

    return (
        <AdminLayout user={user as any} title="ক্যাটাগরি ম্যানেজমেন্ট">
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
                    <div className="relative flex-grow max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="ক্যাটাগরি খুঁজুন..."
                            className="w-full pl-10 pr-4 py-3 bg-white rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={() => openModal()}
                        className="bg-blue-600 text-white px-6 py-3 rounded-xl font-black shadow-lg shadow-blue-200 flex items-center justify-center gap-2 active:scale-95 transition-all"
                    >
                        <Plus size={20} /> নতুন ক্যাটাগরি
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                    {filteredCategories.map((c) => (
                        <div key={c.id} className="bg-white rounded-[32px] overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all group relative">
                            <div className="aspect-video bg-slate-50 relative overflow-hidden">
                                {c.image ? (
                                    <img src={c.image} alt={c.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                                        <ImageIcon size={48} />
                                    </div>
                                )}

                                <div className="absolute top-3 right-3 flex flex-col gap-2 translate-x-12 group-hover:translate-x-0 transition-all z-10">
                                    <button onClick={() => openModal(c)} className="p-2.5 bg-white text-blue-600 rounded-xl shadow-lg hover:bg-blue-600 hover:text-white transition-colors">
                                        <Edit2 size={18} />
                                    </button>
                                    <button onClick={() => handleDelete(c.id)} className="p-2.5 bg-white text-red-600 rounded-xl shadow-lg hover:bg-red-600 hover:text-white transition-colors">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                            <div className="p-5">
                                <div className="flex items-center gap-2 mb-2">
                                    <Layout size={16} className="text-blue-500" />
                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{c.slug}</span>
                                </div>
                                <h3 className="font-black text-slate-900 text-lg line-clamp-1">{c.name}</h3>
                                <p className="text-sm text-slate-500 mt-2 line-clamp-2">{c.description || "No description"}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {isModalOpen && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-0 md:p-4">
                        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
                        <div className="bg-white w-full h-full md:h-auto md:rounded-[40px] md:max-w-2xl md:max-h-[90vh] overflow-hidden relative shadow-2xl flex flex-col">
                            <div className="px-6 md:px-10 py-6 md:py-8 border-b flex justify-between items-center bg-white z-10">
                                <h2 className="text-xl md:text-2xl font-black text-slate-900">
                                    {editingCategory ? 'ক্যাটাগরি এডিট করুন' : 'নতুন ক্যাটাগরি'}
                                </h2>
                                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 md:p-10 space-y-8 overflow-y-auto flex-grow custom-scrollbar">

                                <div className="flex justify-center">
                                    <div className="w-full max-w-md">
                                        <ImageUploader
                                            label="Category Cover"
                                            aspectRatio="video"
                                            value={formData.image}
                                            onChange={(url) => setFormData({ ...formData, image: url })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">নাম</label>
                                        <input required type="text" className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold outline-none" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="যেমন: পোরচ পিলার" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Slug (URL)</label>
                                        <input required type="text" className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold outline-none" value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} placeholder="porch-pillar" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">বিবরণ</label>
                                        <textarea rows={3} className="w-full px-5 py-5 bg-slate-50 border-none rounded-[24px] focus:ring-2 focus:ring-blue-500 font-bold outline-none" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="ক্যাটাগরি সম্পর্কে বিস্তারিত..." />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Icon Name (Lucide)</label>
                                        <input type="text" className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold outline-none" value={formData.icon} onChange={(e) => setFormData({ ...formData, icon: e.target.value })} placeholder="Layout" />
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <button type="submit" className="w-full bg-slate-900 text-white py-6 rounded-[32px] font-black text-lg shadow-2xl shadow-slate-200 hover:bg-slate-800 transition-all active:scale-95 flex items-center justify-center gap-2">
                                        <Check size={28} /> সেইভ করুন
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
