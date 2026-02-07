import React, { useState, useEffect, useRef } from 'react';
import { Save, Upload, Image as ImageIcon, Plus, Trash2, Layout, MessageCircle, Star } from 'lucide-react';
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
        heroBadge: '',
        whatsappNumber: '',
        imoNumber: '',
        featuredProduct: undefined,
        featuredProductTitle: '',
        featuredProductDescription: '',
        categoriesTitle: '',
        categoriesSubtitle: '',
        featuresTitle: '',
        featuresSubtitle: '',
        whyChooseUs: [],
        orderStepsTitle: '',
        orderStepsSubtitle: '',
        orderStepsNote: '',
        orderSteps: [],
        emotionalTrustTitle: '',
        emotionalTrustDescription: '',
        emotionalTrustQuote: '',
        emotionalTrustImage: '',
        blogTitle: '',
        blogSubtitle: '',
        statsTitle: '',
        statsSubtitle: '',
        stats: []
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
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">হিরো ব্যাজ (Badge)</label>
                                    <input type="text" className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold outline-none" value={formData.heroBadge} onChange={(e) => setFormData({ ...formData, heroBadge: e.target.value })} placeholder="বাংলাদেশি পরিবেশ উপযোগী ডিজাইন" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Categories Section Titles */}
                    <div className="space-y-6 border-b border-slate-100 pb-8">
                        <h3 className="text-lg font-black uppercase text-slate-900 flex items-center gap-2">
                            <Layout className="text-purple-600" /> ক্যাটাগরি সেকশন
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">ক্যাটাগরি টাইটেল</label>
                                <input type="text" className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold outline-none" value={formData.categoriesTitle} onChange={(e) => setFormData({ ...formData, categoriesTitle: e.target.value })} placeholder="আমাদের পণ্যসমূহ" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">ক্যাটাগরি সাবটাইটেল</label>
                                <input type="text" className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold outline-none" value={formData.categoriesSubtitle} onChange={(e) => setFormData({ ...formData, categoriesSubtitle: e.target.value })} placeholder="বাড়ি, বারান্দা ও বিল্ডিংয়ের সৌন্দর্য..." />
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
                    <div className="space-y-6 border-b border-slate-100 pb-8">
                        <h3 className="text-lg font-black uppercase text-slate-900 flex items-center gap-2">
                            <Star className="text-orange-500" /> বিশেষ পণ্য (Featured)
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">সিলেক্ট প্রোডাক্ট</label>
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
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">সেকশন টাইটেল (Home Display)</label>
                                <input type="text" className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold outline-none" value={formData.featuredProductTitle} onChange={(e) => setFormData({ ...formData, featuredProductTitle: e.target.value })} placeholder="জনপ্রিয় পণ্য" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">সেকশন ডেসক্রিপশন (Home Display)</label>
                            <textarea rows={2} className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold outline-none" value={formData.featuredProductDescription} onChange={(e) => setFormData({ ...formData, featuredProductDescription: e.target.value })} placeholder="ডেকোরেটিভ পোরচ পিলার – Top, Middle ও Bottom..." />
                        </div>
                    </div>

                    {/* Why Choose Us */}
                    <div className="space-y-6 border-b border-slate-100 pb-8">
                        <h3 className="text-lg font-black uppercase text-slate-900 flex items-center gap-2">
                            <Plus size={14} className="text-blue-600" /> কেন আমাদের বেছে নেবেন?
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">মেইন টাইটেল</label>
                                <input type="text" className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold outline-none" value={formData.featuresTitle} onChange={(e) => setFormData({ ...formData, featuresTitle: e.target.value })} placeholder="কেন Engineers Enterprise বেছে নেবেন?" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">সাবটাইটেল</label>
                                <input type="text" className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold outline-none" value={formData.featuresSubtitle} onChange={(e) => setFormData({ ...formData, featuresSubtitle: e.target.value })} placeholder="আমরা সুন্দর ডিজাইনের পাশাপাশি গুণগত..." />
                            </div>
                        </div>
                        <div className="flex justify-between items-center pt-4">
                            <h4 className="text-xs font-black uppercase text-slate-400 tracking-widest">বৈশিষ্ট্যসমূহ (Features List)</h4>
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
                    <div className="space-y-6 border-b border-slate-100 pb-8">
                        <h3 className="text-lg font-black uppercase text-slate-900 flex items-center gap-2">
                            <MessageCircle className="text-blue-600" /> অর্ডার করার ধাপসমূহ
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">অর্ডার সেকশন টাইটেল</label>
                                <input type="text" className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold outline-none" value={formData.orderStepsTitle} onChange={(e) => setFormData({ ...formData, orderStepsTitle: e.target.value })} placeholder="কিভাবে অর্ডার করবেন?" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">অর্ডার সেকশন সাবটাইটেল</label>
                                <input type="text" className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold outline-none" value={formData.orderStepsSubtitle} onChange={(e) => setFormData({ ...formData, orderStepsSubtitle: e.target.value })} placeholder="সরাসরি আলোচনার মাধ্যমে ঝামেলামুক্ত..." />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">বিঃদ্রঃ নোট (Bottom Note)</label>
                                <input type="text" className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold outline-none" value={formData.orderStepsNote} onChange={(e) => setFormData({ ...formData, orderStepsNote: e.target.value })} placeholder="বিঃদ্রঃ: অনলাইন পেমেন্ট প্রয়োজন নেই..." />
                            </div>
                        </div>
                        <div className="flex justify-between items-center pt-4">
                            <h4 className="text-xs font-black uppercase text-slate-400 tracking-widest">অর্ডার ধাপসমূহ (Steps List)</h4>
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

                    {/* Emotional Trust Section */}
                    <div className="space-y-6 border-b border-slate-100 pb-8">
                        <h3 className="text-lg font-black uppercase text-slate-900 flex items-center gap-2">
                            <Star className="text-blue-500" /> ইমোশনাল ট্রাস্ট সেকশন
                        </h3>
                        <div className="flex flex-col md:flex-row gap-8">
                            <div className="w-full md:w-1/3">
                                <ImageUploader
                                    label="Trust Section Image"
                                    value={formData.emotionalTrustImage}
                                    onChange={(url) => setFormData({ ...formData, emotionalTrustImage: url })}
                                />
                            </div>
                            <div className="w-full md:w-2/3 space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">ট্রাস্ট টাইটেল</label>
                                    <input type="text" className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold outline-none font-bold" value={formData.emotionalTrustTitle} onChange={(e) => setFormData({ ...formData, emotionalTrustTitle: e.target.value })} placeholder="আপনার বাড়ির সৌন্দর্য, আমাদের দায়িত্ব" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">ট্রাস্ট ডেসক্রিপশন</label>
                                    <textarea rows={3} className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold outline-none" value={formData.emotionalTrustDescription} onChange={(e) => setFormData({ ...formData, emotionalTrustDescription: e.target.value })} placeholder="আমরা বিশ্বাস করি একটি সুন্দর বাড়ি..." />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">ট্রাস্ট কোট (Quote)</label>
                                    <input type="text" className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold outline-none italic" value={formData.emotionalTrustQuote} onChange={(e) => setFormData({ ...formData, emotionalTrustQuote: e.target.value })} placeholder="আমরা শুধু ম্যাটেরিয়াল বিক্রি করি না..." />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Blog & Stats Titles */}
                    <div className="space-y-6 border-b border-slate-100 pb-8">
                        <h3 className="text-lg font-black uppercase text-slate-900 flex items-center gap-2">
                            <Layout className="text-blue-600" /> ব্লগ ও পরিসংখ্যান টাইটেল
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">ব্লগ টাইটেল</label>
                                    <input type="text" className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold outline-none" value={formData.blogTitle} onChange={(e) => setFormData({ ...formData, blogTitle: e.target.value })} placeholder="জানুন ও বুঝে নিন" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">ব্লগ সাবটাইটেল</label>
                                    <input type="text" className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold outline-none" value={formData.blogSubtitle} onChange={(e) => setFormData({ ...formData, blogSubtitle: e.target.value })} placeholder="পিলার, ফ্যান্সি ব্লক ও কংক্রিট ডিজাইন..." />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">পরিসংখ্যান (Stats) টাইটেল</label>
                                    <input type="text" className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold outline-none" value={formData.statsTitle} onChange={(e) => setFormData({ ...formData, statsTitle: e.target.value })} placeholder="আমাদের অর্জন" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">পরিসংখ্যান সাবটাইটেল</label>
                                    <input type="text" className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold outline-none" value={formData.statsSubtitle} onChange={(e) => setFormData({ ...formData, statsSubtitle: e.target.value })} placeholder="দীর্ঘ পথচলায় আমরা আপনাদের পাশে..." />
                                </div>
                            </div>
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
