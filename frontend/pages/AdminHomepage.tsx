import React, { useState, useEffect, useRef } from 'react';
import { Save, Upload, Image as ImageIcon, Plus, Trash2, Layout, MessageCircle } from 'lucide-react';
import ImageUploader from '../components/ui/ImageUploader';
import { HomepageData, Product } from '../types';
import AdminLayout from '../components/AdminLayout';
import { api } from '../api';

export default function AdminHomepage() {
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState<Product[]>([]);
    const [formData, setFormData] = useState<Partial<HomepageData>>({
        heroTitle: '',
        heroSubtitle: '',
        heroImage: '',
        whatsappNumber: '',
        imoNumber: '',
        featuredProduct: undefined,
        whyChooseUs: [],
        orderSteps: []
    });
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [homeData, productsData] = await Promise.all([
                    api.getHomepage(),
                    api.getProducts()
                ]);

                if (homeData) {
                    setFormData(homeData);
                }
                setProducts(productsData);
            } catch (error) {
                console.error("Failed to fetch homepage data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, heroImage: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Strapi expects relation IDs for updates, not full objects. 
            // check if featuredProduct is an object (populated) or ID.
            // My updateHomepage sends `data`. 
            // If `featuredProduct` is an object, I should extract ID.
            const payload = { ...formData };
            if (payload.featuredProduct && typeof payload.featuredProduct === 'object') {
                payload.featuredProduct = (payload.featuredProduct as any).id;
            }

            await api.updateHomepage(payload);
            alert("Homepage saved successfully!");
        } catch (error) {
            console.error("Failed to save homepage", error);
            alert("Failed to save homepage");
        }
    };

    const addWhyChooseUs = () => {
        setFormData(prev => ({
            ...prev,
            whyChooseUs: [...(prev.whyChooseUs || []), { title: '', description: '', icon: 'CheckCircle2' }]
        }));
    };

    const removeWhyChooseUs = (index: number) => {
        setFormData(prev => ({
            ...prev,
            whyChooseUs: prev.whyChooseUs?.filter((_, i) => i !== index)
        }));
    };

    const updateWhyChooseUs = (index: number, field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            whyChooseUs: prev.whyChooseUs?.map((item, i) => i === index ? { ...item, [field]: value } : item)
        }));
    };

    const addOrderStep = () => {
        setFormData(prev => ({
            ...prev,
            orderSteps: [...(prev.orderSteps || []), { title: '', description: '', icon: 'Layout' }]
        }));
    };

    const removeOrderStep = (index: number) => {
        setFormData(prev => ({
            ...prev,
            orderSteps: prev.orderSteps?.filter((_, i) => i !== index)
        }));
    };

    const updateOrderStep = (index: number, field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            orderSteps: prev.orderSteps?.map((item, i) => i === index ? { ...item, [field]: value } : item)
        }));
    };

    const user = { name: 'Admin', role: 'Administrator' };

    return (
        <AdminLayout user={user as any} title="হোমপেজ এডিটর">
            <div className="max-w-5xl mx-auto">
                <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-[40px] shadow-sm border border-slate-100">

                    {/* Hero Section */}
                    <div className="space-y-6 border-b border-slate-100 pb-8">
                        <h3 className="text-lg font-black uppercase text-slate-900 flex items-center gap-2">
                            <Layout className="text-blue-600" /> হিরো সেকশন
                        </h3>

                        <div className="flex flex-col md:flex-row gap-8">
                            <div className="w-full md:w-1/3">
                                <ImageUploader
                                    label="Hero Background"
                                    value={formData.heroImage}
                                    onChange={(url) => setFormData({ ...formData, heroImage: url })}
                                />
                                <p className="text-center text-xs text-slate-400 mt-2 font-bold">Recommended: 1920x1080px</p>
                            </div>

                            <div className="w-full md:w-2/3 space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">হিরো টাইটেল</label>
                                    <input type="text" className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold outline-none text-lg" value={formData.heroTitle} onChange={(e) => setFormData({ ...formData, heroTitle: e.target.value })} placeholder="ডেকোরেটিভ কংক্রিট পিলার..." />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">সাবটাইটেল</label>
                                    <textarea rows={3} className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold outline-none" value={formData.heroSubtitle} onChange={(e) => setFormData({ ...formData, heroSubtitle: e.target.value })} placeholder="মজবুত, টেকসই ও প্রিমিয়াম..." />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Numbers */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b border-slate-100 pb-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                                <MessageCircle size={14} className="text-green-500" /> WhatsApp নম্বর
                            </label>
                            <input type="text" className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold outline-none" value={formData.whatsappNumber} onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })} placeholder="+8801..." />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                                <MessageCircle size={14} className="text-blue-500" /> IMO নম্বর
                            </label>
                            <input type="text" className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold outline-none" value={formData.imoNumber} onChange={(e) => setFormData({ ...formData, imoNumber: e.target.value })} placeholder="+8801..." />
                        </div>
                    </div>

                    {/* Featured Product */}
                    <div className="border-b border-slate-100 pb-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Featured Product</label>
                            <select
                                className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold outline-none"
                                value={formData.featuredProduct ? (formData.featuredProduct as any).id || formData.featuredProduct : ''}
                                onChange={(e) => {
                                    const selectedId = e.target.value;
                                    const selectedProduct = products.find(p => p.id.toString() === selectedId);
                                    setFormData({ ...formData, featuredProduct: selectedProduct });
                                }}
                            >
                                <option value="">Select a product...</option>
                                {products.map(p => (
                                    <option key={p.id} value={p.id}>{p.name} ({p.modelNo})</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Why Choose Us */}
                    <div className="space-y-6 border-b border-slate-100 pb-8">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-black uppercase text-slate-900">Why Choose Us</h3>
                            <button type="button" onClick={addWhyChooseUs} className="text-[10px] font-black bg-slate-900 text-white px-4 py-2 rounded-xl flex items-center gap-2">
                                <Plus size={14} /> Add Item
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {formData.whyChooseUs?.map((item, idx) => (
                                <div key={idx} className="bg-slate-50 p-6 rounded-3xl relative group">
                                    <button type="button" onClick={() => removeWhyChooseUs(idx)} className="absolute top-2 right-2 p-2 bg-red-100 text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Trash2 size={16} />
                                    </button>
                                    <div className="space-y-3">
                                        <input type="text" placeholder="Title" className="w-full bg-white px-4 py-2 rounded-xl text-sm font-bold outline-none" value={item.title} onChange={(e) => updateWhyChooseUs(idx, 'title', e.target.value)} />
                                        <textarea placeholder="Description" rows={2} className="w-full bg-white px-4 py-2 rounded-xl text-sm font-medium outline-none" value={item.description} onChange={(e) => updateWhyChooseUs(idx, 'description', e.target.value)} />
                                        <input type="text" placeholder="Icon Name (Lucide)" className="w-full bg-white px-4 py-2 rounded-xl text-xs font-mono outline-none" value={item.icon} onChange={(e) => updateWhyChooseUs(idx, 'icon', e.target.value)} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Order Steps */}
                    <div className="space-y-6 pb-8">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-black uppercase text-slate-900">Order Steps</h3>
                            <button type="button" onClick={addOrderStep} className="text-[10px] font-black bg-slate-900 text-white px-4 py-2 rounded-xl flex items-center gap-2">
                                <Plus size={14} /> Add Step
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {formData.orderSteps?.map((item, idx) => (
                                <div key={idx} className="bg-slate-50 p-6 rounded-3xl relative group">
                                    <button type="button" onClick={() => removeOrderStep(idx)} className="absolute top-2 right-2 p-2 bg-red-100 text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Trash2 size={16} />
                                    </button>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">{idx + 1}</span>
                                            <input type="text" placeholder="Step Title" className="w-full bg-white px-4 py-2 rounded-xl text-sm font-bold outline-none" value={item.title} onChange={(e) => updateOrderStep(idx, 'title', e.target.value)} />
                                        </div>
                                        <textarea placeholder="Step Description" rows={2} className="w-full bg-white px-4 py-2 rounded-xl text-sm font-medium outline-none" value={item.description} onChange={(e) => updateOrderStep(idx, 'description', e.target.value)} />
                                        <input type="text" placeholder="Icon Name" className="w-full bg-white px-4 py-2 rounded-xl text-xs font-mono outline-none" value={item.icon} onChange={(e) => updateOrderStep(idx, 'icon', e.target.value)} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="pt-6 sticky bottom-6 z-20">
                        <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-lg shadow-2xl shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95 flex items-center justify-center gap-2 backdrop-blur-md">
                            <Save size={20} /> হোমপেজ আপডেট করুন
                        </button>
                    </div>

                </form>
            </div>
        </AdminLayout>
    );
}
