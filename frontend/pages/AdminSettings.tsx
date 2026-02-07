
import React, { useState } from 'react';
import { 
  Settings, Building2, Phone, MessageSquare, 
  FileText, ShoppingCart, Users, Save, Upload, Check, Copy, 
  Trash2, Plus, Info, ChevronRight
} from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import { UserRole, AppSettings, OrderStatus } from '../types';

interface Props {
  user: { name: string, role: UserRole };
}

export default function AdminSettings({ user }: Props) {
  const [activeTab, setActiveTab] = useState<'company' | 'contact' | 'invoice' | 'orders' | 'users'>('company');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [copied, setCopied] = useState(false);

  // Mock Settings State
  const [settings, setSettings] = useState<AppSettings>({
    company: {
      name: 'Engineers Enterprise',
      tagline: 'ডেকোরেটিভ কংক্রিট পিলার ও বিল্ডিং ডিজাইন',
      address: 'উত্তরা হাউজ বিল্ডিং এর পাশে, উত্তরা, ঢাকা-১২৩০।',
      logo: 'https://images.unsplash.com/photo-1541888946425-d81bb19480c5?auto=format&fit=crop&q=80&w=100',
      favicon: 'https://via.placeholder.com/32'
    },
    contact: {
      phone: '+৮৮০ ১৭XXXXXXXXX',
      whatsapp: '+৮৮০ ১৭XXXXXXXXX',
      imo: '+৮৮০ ১৭XXXXXXXXX',
      defaultMessage: 'আসসালামু আলাইকুম ইঞ্জিনিয়ার্স এন্টারপ্রাইজ, আমি আপনার পণ্য সম্পর্কে জানতে চাই।'
    },
    invoice: {
      prefix: 'EE-INV',
      startNumber: 1001,
      terms: [
        'কাস্টম ডিজাইনের পণ্য ফেরতযোগ্য নয়।',
        'পরিবহন খরচ ও লেবার খরচ কাস্টমার বহন করবে।',
        'রঙ ও ডিজাইনে ছবি থেকে সামান্য পার্থক্য হতে পারে।'
      ]
    },
    orders: {
      defaultStatus: OrderStatus.DRAFT,
      defaultDeliveryCharge: 0
    }
  });

  const handleSave = () => {
    setSaveStatus('saving');
    // Simulate API call
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 1500);
  };

  const updateSetting = (section: keyof AppSettings, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...(prev[section] as any),
        [key]: value
      }
    }));
  };

  const handleFileUpload = (section: 'company', key: 'logo' | 'favicon', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateSetting(section, key, reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(settings.contact.defaultMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tabs = [
    { id: 'company', name: 'কোম্পানি', icon: Building2 },
    { id: 'contact', name: 'যোগাযোগ', icon: Phone },
    { id: 'invoice', name: 'ইনভয়েস', icon: FileText },
    { id: 'orders', name: 'অর্ডার', icon: ShoppingCart },
    { id: 'users', name: 'ইউজার', icon: Users },
  ] as const;

  return (
    <AdminLayout user={user} title="সিস্টেম সেটিংস">
      <div className="max-w-4xl mx-auto space-y-6 md:space-y-10">
        
        {/* Tab Navigation - Scrollable Pills for Mobile */}
        <div className="flex flex-col gap-2">
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">কনফিগারেশন সেকশন</p>
           <div className="bg-white p-2 rounded-[24px] md:rounded-[32px] border border-slate-100 shadow-sm flex overflow-x-auto no-scrollbar gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3.5 rounded-2xl font-black transition-all shrink-0 uppercase text-[10px] md:text-xs tracking-widest ${
                  activeTab === tab.id 
                  ? 'bg-blue-600 text-white shadow-xl shadow-blue-100 scale-105' 
                  : 'text-slate-400 hover:bg-slate-50'
                }`}
              >
                <tab.icon size={16} />
                <span>{tab.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-[32px] md:rounded-[48px] border border-slate-100 shadow-sm overflow-hidden min-h-[500px]">
          <div className="p-6 md:p-12">
            
            {activeTab === 'company' && (
              <div className="space-y-8 md:space-y-12 animate-in fade-in duration-300">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-50 rounded-2xl text-blue-600"><Building2 size={24} /></div>
                  <h3 className="text-xl md:text-3xl font-black text-slate-900 tracking-tight">কোম্পানির তথ্য</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-2">কোম্পানির নাম</label>
                    <input 
                      type="text" 
                      className="w-full p-5 bg-slate-50 border-none rounded-3xl focus:ring-2 focus:ring-blue-500 font-black outline-none transition-all"
                      value={settings.company.name}
                      onChange={(e) => updateSetting('company', 'name', e.target.value)}
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-2">ট্যাগলাইন (Bangla)</label>
                    <input 
                      type="text" 
                      className="w-full p-5 bg-slate-50 border-none rounded-3xl focus:ring-2 focus:ring-blue-500 font-black outline-none transition-all"
                      value={settings.company.tagline}
                      onChange={(e) => updateSetting('company', 'tagline', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-2">ঠিকানা</label>
                  <textarea 
                    rows={4}
                    className="w-full p-6 bg-slate-50 border-none rounded-[32px] focus:ring-2 focus:ring-blue-500 font-black outline-none leading-relaxed transition-all"
                    value={settings.company.address}
                    onChange={(e) => updateSetting('company', 'address', e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-2">কোম্পানির লোগো</label>
                    <div className="flex items-center gap-6 p-4 bg-slate-50 rounded-[32px] border border-slate-100">
                      <div className="w-20 h-20 rounded-3xl bg-white border border-slate-100 flex items-center justify-center overflow-hidden shadow-sm">
                        <img src={settings.company.logo} alt="Logo" className="w-full h-full object-cover" />
                      </div>
                      <label className="bg-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest text-blue-600 shadow-sm cursor-pointer hover:bg-blue-600 hover:text-white transition-all flex items-center gap-2">
                        <Upload size={14} /> আপলোড
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload('company', 'logo', e)} />
                      </label>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-2">ফেভিকন (Favicon)</label>
                    <div className="flex items-center gap-6 p-4 bg-slate-50 rounded-[32px] border border-slate-100">
                      <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 flex items-center justify-center overflow-hidden shadow-sm">
                        <img src={settings.company.favicon} alt="Favicon" className="w-8 h-8 object-contain" />
                      </div>
                      <label className="bg-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest text-blue-600 shadow-sm cursor-pointer hover:bg-blue-600 hover:text-white transition-all flex items-center gap-2">
                        <Upload size={14} /> আপলোড
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload('company', 'favicon', e)} />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'contact' && (
              <div className="space-y-8 md:space-y-12 animate-in fade-in duration-300">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-50 rounded-2xl text-blue-600"><Phone size={24} /></div>
                  <h3 className="text-xl md:text-3xl font-black text-slate-900 tracking-tight">যোগাযোগের তথ্য</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-2">ফোন নম্বর</label>
                    <input 
                      type="text" 
                      className="w-full p-5 bg-slate-50 border-none rounded-3xl focus:ring-2 focus:ring-blue-500 font-black outline-none transition-all"
                      value={settings.contact.phone}
                      onChange={(e) => updateSetting('contact', 'phone', e.target.value)}
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-2">WhatsApp নম্বর</label>
                    <input 
                      type="text" 
                      className="w-full p-5 bg-slate-50 border-none rounded-3xl focus:ring-2 focus:ring-blue-500 font-black outline-none transition-all"
                      value={settings.contact.whatsapp}
                      onChange={(e) => updateSetting('contact', 'whatsapp', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-2">IMO নম্বর</label>
                  <input 
                    type="text" 
                    className="w-full p-5 bg-slate-50 border-none rounded-3xl focus:ring-2 focus:ring-blue-500 font-black outline-none transition-all"
                    value={settings.contact.imo}
                    onChange={(e) => updateSetting('contact', 'imo', e.target.value)}
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center px-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">WhatsApp ডিফল্ট মেসেজ</label>
                    <button onClick={copyToClipboard} className="text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-full transition-all hover:bg-blue-600 hover:text-white">
                      {copied ? <Check size={12} /> : <Copy size={12} />} {copied ? 'কপি হয়েছে' : 'কপি করুন'}
                    </button>
                  </div>
                  <textarea 
                    rows={4}
                    className="w-full p-6 bg-green-50/50 border-2 border-green-100 rounded-[32px] focus:ring-2 focus:ring-green-500 font-bold text-slate-700 outline-none transition-all"
                    value={settings.contact.defaultMessage}
                    onChange={(e) => updateSetting('contact', 'defaultMessage', e.target.value)}
                  />
                  <div className="p-6 bg-blue-50/50 rounded-[32px] border border-blue-100 flex items-start gap-4 shadow-inner">
                    <Info size={24} className="text-blue-600 shrink-0" />
                    <p className="text-xs font-bold text-blue-900 leading-relaxed italic">এই মেসেজটি কাস্টমার যখন ওয়েবসাইট থেকে WhatsApp বাটনে ক্লিক করবে তখন তাদের ফোনে অটোমেটিক টাইপ হয়ে থাকবে। এটি কাস্টমারকে দ্রুত মেসেজ পাঠাতে সাহায্য করে।</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'invoice' && (
              <div className="space-y-8 md:space-y-12 animate-in fade-in duration-300">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-50 rounded-2xl text-blue-600"><FileText size={24} /></div>
                  <h3 className="text-xl md:text-3xl font-black text-slate-900 tracking-tight">ইনভয়েস সেটিংস</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-2">ইনভয়েস প্রিফিক্স (Prefix)</label>
                    <input 
                      type="text" 
                      className="w-full p-5 bg-slate-50 border-none rounded-3xl focus:ring-2 focus:ring-blue-500 font-black outline-none transition-all"
                      value={settings.invoice.prefix}
                      onChange={(e) => updateSetting('invoice', 'prefix', e.target.value)}
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-2">শুরু করার নম্বর</label>
                    <input 
                      type="number" 
                      className="w-full p-5 bg-slate-50 border-none rounded-3xl focus:ring-2 focus:ring-blue-500 font-black outline-none transition-all"
                      value={settings.invoice.startNumber}
                      onChange={(e) => updateSetting('invoice', 'startNumber', parseInt(e.target.value))}
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex justify-between items-center px-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">শর্তাবলী (Terms & Conditions)</label>
                    <button 
                      onClick={() => updateSetting('invoice', 'terms', [...settings.invoice.terms, ''])}
                      className="text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-full hover:bg-blue-600 hover:text-white transition-all"
                    >
                      <Plus size={12} /> নতুন লাইন
                    </button>
                  </div>
                  <div className="space-y-4">
                    {settings.invoice.terms.map((term, idx) => (
                      <div key={idx} className="flex gap-3 group/term">
                        <div className="flex-grow relative">
                           <input 
                            type="text" 
                            className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold text-sm outline-none transition-all"
                            value={term}
                            onChange={(e) => {
                              const newTerms = [...settings.invoice.terms];
                              newTerms[idx] = e.target.value;
                              updateSetting('invoice', 'terms', newTerms);
                            }}
                          />
                        </div>
                        <button 
                          onClick={() => {
                            const newTerms = settings.invoice.terms.filter((_, i) => i !== idx);
                            updateSetting('invoice', 'terms', newTerms);
                          }}
                          className="p-4 bg-white text-red-400 hover:bg-red-500 hover:text-white rounded-2xl shadow-sm transition-all border border-slate-100"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="space-y-8 md:space-y-12 animate-in fade-in duration-300">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-50 rounded-2xl text-blue-600"><ShoppingCart size={24} /></div>
                  <h3 className="text-xl md:text-3xl font-black text-slate-900 tracking-tight">অর্ডার কনফিগারেশন</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-2">ডিফল্ট স্ট্যাটাস</label>
                    <select 
                      className="w-full p-5 bg-slate-50 border-none rounded-3xl focus:ring-2 focus:ring-blue-500 font-black outline-none appearance-none transition-all"
                      value={settings.orders.defaultStatus}
                      onChange={(e) => updateSetting('orders', 'defaultStatus', e.target.value as OrderStatus)}
                    >
                      {Object.values(OrderStatus).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-2">ডিফল্ট ডেলিভারি চার্জ (৳)</label>
                    <input 
                      type="number" 
                      className="w-full p-5 bg-slate-50 border-none rounded-3xl focus:ring-2 focus:ring-blue-500 font-black outline-none transition-all"
                      value={settings.orders.defaultDeliveryCharge}
                      onChange={(e) => updateSetting('orders', 'defaultDeliveryCharge', parseInt(e.target.value))}
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div className="space-y-8 md:space-y-12 animate-in fade-in duration-300">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-50 rounded-2xl text-blue-600"><Users size={24} /></div>
                  <h3 className="text-xl md:text-3xl font-black text-slate-900 tracking-tight">ইউজার ম্যানেজমেন্ট</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {[
                    { name: 'ম্যানেজার সাহেব', role: UserRole.ADMIN, email: 'admin@engineers.com' },
                    { name: 'হাসান আলী', role: UserRole.STAFF, email: 'staff1@engineers.com' },
                  ].map((sysUser, idx) => (
                    <div key={idx} className="bg-slate-50 p-6 rounded-[32px] border border-slate-100 flex flex-col justify-between h-full relative overflow-hidden group">
                      <div className="absolute top-4 right-4 bg-white/80 backdrop-blur px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest text-blue-600 shadow-sm">
                        {sysUser.role}
                      </div>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-xl shadow-lg shadow-blue-100">
                          {sysUser.name[0]}
                        </div>
                        <div>
                          <p className="font-black text-slate-900 text-base leading-tight mb-1">{sysUser.name}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{sysUser.email}</p>
                        </div>
                      </div>
                      <div className="mt-6 pt-4 border-t border-white flex justify-end">
                         <button className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-blue-600 transition-all flex items-center gap-1">Manage <ChevronRight size={12} /></button>
                      </div>
                    </div>
                  ))}
                  <button className="flex flex-col items-center justify-center p-8 bg-white border-2 border-dashed border-slate-100 rounded-[32px] text-slate-300 hover:border-blue-600 hover:text-blue-600 transition-all active:scale-95 group">
                    <div className="w-12 h-12 rounded-full border-2 border-dashed border-slate-100 flex items-center justify-center mb-3 group-hover:border-blue-600 transition-all">
                       <Plus size={24} />
                    </div>
                    <span className="font-black text-[10px] uppercase tracking-widest">নতুন স্টাফ</span>
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Action Bar - Fixed Bottom for Mobile */}
        <div className="fixed bottom-20 left-4 right-4 md:relative md:bottom-auto md:left-auto md:right-auto bg-slate-900 p-4 md:p-8 rounded-[32px] md:rounded-[48px] shadow-2xl flex flex-row justify-between items-center gap-4 no-print z-50">
          <div className="text-white hidden sm:block">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] leading-none mb-2">সেটিং ম্যানেজমেন্ট</p>
            <p className="text-sm font-black text-blue-400">অ্যাডমিন প্রিভিলেজ সক্রিয়</p>
          </div>
          
          <div className="flex gap-4 w-full sm:w-auto">
            <button className="hidden sm:block px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest text-slate-400 hover:text-white transition-all">
              রিসেট
            </button>
            <button 
              onClick={handleSave}
              disabled={saveStatus === 'saving'}
              className={`flex-grow sm:flex-grow-0 px-12 py-5 rounded-[24px] font-black text-sm uppercase tracking-widest shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-3 ${
                saveStatus === 'saved' 
                ? 'bg-green-600 text-white shadow-green-200' 
                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200'
              }`}
            >
              {saveStatus === 'saving' ? (
                <div className="flex items-center gap-3">
                   <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                   <span>সেভ হচ্ছে...</span>
                </div>
              ) : saveStatus === 'saved' ? (
                <><Check size={20} /> সেভ হয়েছে</>
              ) : (
                <><Save size={20} /> সেটিংস আপডেট</>
              )}
            </button>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
}
