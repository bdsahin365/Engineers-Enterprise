import React, { useState, useEffect, useRef } from 'react';
import { Save, Upload, Image as ImageIcon, Globe, Phone, Mail, MapPin, Facebook, Youtube } from 'lucide-react';
import ImageUploader from '../components/ui/ImageUploader';
import { GlobalData } from '../types';
import AdminLayout from '../components/AdminLayout';
import { api } from '../api';

export default function AdminGlobalSettings() {
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState<Partial<GlobalData>>({
        siteName: '',
        logo: '',
        contactPhone: '',
        contactEmail: '',
        address: '',
        facebookLink: '',
        youtubeLink: ''
    });
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const fetchGlobal = async () => {
            try {
                const data = await api.getGlobal();
                if (data) {
                    setFormData(data);
                }
            } catch (error) {
                console.error("Failed to fetch global settings", error);
            } finally {
                setLoading(false);
            }
        };
        fetchGlobal();
    }, []);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, logo: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.updateGlobal(formData);
            alert("Settings saved successfully!");
        } catch (error) {
            console.error("Failed to save settings", error);
            alert("Failed to save settings");
        }
    };

    const user = { name: 'Admin', role: 'Administrator' };

    return (
        <AdminLayout user={user as any} title="গ্লোবাল সেটিংস">
            <div className="max-w-4xl mx-auto">
                <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-[40px] shadow-sm border border-slate-100">

                    {/* Logo Section */}
                    <div className="flex flex-col items-center space-y-4">
                        <div className="w-32">
                            <ImageUploader
                                label="Site Logo"
                                aspectRatio="square"
                                value={formData.logo}
                                onChange={(url) => setFormData({ ...formData, logo: url })}
                            />
                        </div>
                        <p className="text-xs font-bold uppercase text-slate-400 tracking-widest">সাইট লোগো</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                                <Globe size={14} /> সাইট নাম
                            </label>
                            <input type="text" className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold outline-none" value={formData.siteName} onChange={(e) => setFormData({ ...formData, siteName: e.target.value })} placeholder="Engineers Enterprise" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                                <Phone size={14} /> কন্টাক্ট ফোন
                            </label>
                            <input type="text" className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold outline-none" value={formData.contactPhone} onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })} placeholder="+880 17..." />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                                <Mail size={14} /> ইমেইল ঠিকানা
                            </label>
                            <input type="email" className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold outline-none" value={formData.contactEmail} onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })} placeholder="contact@example.com" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                                <MapPin size={14} /> ঠিকানা
                            </label>
                            <input type="text" className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold outline-none" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} placeholder="House 12, Road 5..." />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                                <Facebook size={14} /> ফেসবুক লিংক
                            </label>
                            <input type="text" className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold outline-none" value={formData.facebookLink} onChange={(e) => setFormData({ ...formData, facebookLink: e.target.value })} placeholder="https://facebook.com/..." />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                                <Youtube size={14} /> ইউটিউব লিংক
                            </label>
                            <input type="text" className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold outline-none" value={formData.youtubeLink} onChange={(e) => setFormData({ ...formData, youtubeLink: e.target.value })} placeholder="https://youtube.com/..." />
                        </div>
                    </div>

                    <div className="pt-6">
                        <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-lg shadow-xl hover:bg-blue-700 transition-all active:scale-95 flex items-center justify-center gap-2">
                            <Save size={20} /> সেটিংস আপডেট করুন
                        </button>
                    </div>

                </form>
            </div>
        </AdminLayout>
    );
}
