
import React, { useState } from 'react';
import { 
  Search, Plus, X, Edit2, Phone, MapPin, 
  FileText, Check
} from 'lucide-react';
import { Customer } from '../types';
import AdminLayout from '../components/AdminLayout';

interface Props {
  customers: Customer[];
  onAddCustomer: (customer: Customer) => void;
  onUpdateCustomer: (customer: Customer) => void;
}

const AdminCustomers: React.FC<Props> = ({ customers, onAddCustomer, onUpdateCustomer }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    notes: ''
  });

  const filtered = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.phone.includes(searchTerm)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCustomer) {
      onUpdateCustomer({ ...editingCustomer, ...formData });
    } else {
      if (customers.find(c => c.phone === formData.phone)) {
        alert("এই মোবাইল নম্বর দিয়ে অলরেডি গ্রাহক আছে!");
        return;
      }
      onAddCustomer({
        ...formData,
        id: 'c' + Date.now(),
        createdAt: new Date().toISOString().split('T')[0]
      });
    }
    setIsModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({ name: '', phone: '', address: '', notes: '' });
    setEditingCustomer(null);
  };

  const openEdit = (c: Customer) => {
    setEditingCustomer(c);
    setFormData({ name: c.name, phone: c.phone, address: c.address, notes: c.notes || '' });
    setIsModalOpen(true);
  };

  const user = { name: 'ম্যানেজার সাহেব', role: (window as any).currentUserRole || 'অ্যাডমিন' }; // Simple fallback

  return (
    <AdminLayout user={user as any} title="গ্রাহক ম্যানেজমেন্ট">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
          <div className="relative flex-grow max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="নাম বা মোবাইল নম্বর..." 
              className="w-full pl-10 pr-4 py-3 bg-white rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
              value={searchTerm} 
              onChange={e => setSearchTerm(e.target.value)} 
            />
          </div>
          <button 
            onClick={() => setIsModalOpen(true)} 
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-blue-200 flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            <Plus size={20} /> নতুন গ্রাহক
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
           {filtered.map(c => (
             <div key={c.id} className="bg-white p-6 md:p-8 rounded-[24px] md:rounded-[32px] border shadow-sm hover:shadow-xl transition-all group relative">
                <button onClick={() => openEdit(c)} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                  <Edit2 size={18} />
                </button>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-lg md:text-xl border-2 border-white shadow-sm">
                    {c.name[0]}
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900 leading-tight">{c.name}</h3>
                    <p className="text-xs text-slate-400 font-bold uppercase mt-1">কাস্টমার আইডি: #{c.id.slice(-4)}</p>
                  </div>
                </div>
                <div className="space-y-3">
                   <div className="flex items-center gap-3 text-slate-500 font-bold text-sm bg-slate-50 p-2.5 rounded-xl">
                    <Phone size={16} className="text-blue-500" /> {c.phone}
                   </div>
                   <div className="flex items-start gap-3 text-slate-500 font-bold text-sm p-2.5">
                    <MapPin size={16} className="text-blue-500 shrink-0 mt-0.5" /> 
                    <span className="line-clamp-2">{c.address}</span>
                   </div>
                   {c.notes && (
                     <div className="flex items-start gap-3 text-slate-400 font-medium text-xs italic p-2.5 border-t border-slate-50">
                      <FileText size={14} className="shrink-0 mt-0.5" /> 
                      <span className="line-clamp-1">{c.notes}</span>
                     </div>
                   )}
                </div>
             </div>
           ))}
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-0 md:p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
            <div className="bg-white w-full h-full md:h-auto md:rounded-[40px] md:max-w-lg p-6 md:p-10 relative shadow-2xl flex flex-col md:block">
               <div className="flex justify-between items-center mb-8 md:mb-10">
                  <h2 className="text-xl md:text-2xl font-black text-slate-900">{editingCustomer ? 'গ্রাহক এডিট করুন' : 'নতুন গ্রাহক'}</h2>
                  <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={24} /></button>
               </div>
               <form onSubmit={handleSubmit} className="space-y-6 flex-grow overflow-y-auto">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">গ্রাহকের নাম</label>
                     <input required type="text" className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold outline-none" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">মোবাইল নম্বর</label>
                     <input required type="tel" className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold outline-none" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">ঠিকানা</label>
                     <textarea required className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold outline-none" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} rows={3}></textarea>
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">নোট (ঐচ্ছিক)</label>
                     <input type="text" className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold outline-none" value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} />
                  </div>
                  <button type="submit" className="w-full bg-slate-900 text-white py-5 rounded-[24px] font-black text-lg shadow-xl hover:bg-slate-800 active:scale-95 transition-all flex items-center justify-center gap-2 mt-4">
                    <Check size={24} /> সেভ করুন
                  </button>
               </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminCustomers;
