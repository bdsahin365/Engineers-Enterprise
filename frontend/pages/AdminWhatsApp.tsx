
import React, { useState } from 'react';
import { 
  Copy, ExternalLink, CheckCircle2
} from 'lucide-react';
import { Order, Customer } from '../types';
import { WHATSAPP_NUMBER } from '../constants';
import AdminLayout from '../components/AdminLayout';

interface Props {
  orders: Order[];
  customers: Customer[];
}

const AdminWhatsApp: React.FC<Props> = ({ orders, customers }) => {
  const [selectedOrderId, setSelectedOrderId] = useState('');
  const [copied, setCopied] = useState(false);

  const selectedOrder = orders.find(o => o.id === selectedOrderId);
  const customer = customers.find(c => c?.id === selectedOrder?.customerId);

  const generateMessage = () => {
    if (!selectedOrder || !customer) return "দয়া করে একটি অর্ডার নির্বাচন করুন।";
    return `আসসালামু আলাইকুম ${customer.name} সাহেব,
আপনার অর্ডার নং: ${selectedOrder.orderNo} কনফার্ম করা হয়েছে। 
মোট মূল্য: ৳${selectedOrder.totalPrice.toLocaleString()}।
ডেলিভারি ঠিকানা: ${selectedOrder.deliveryAddress}। 
ধন্যবাদ, ইঞ্জিনিয়ার্স এন্টারপ্রাইজ।`;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateMessage());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const user = { name: 'ম্যানেজার সাহেব', role: 'অ্যাডমিন' };

  return (
    <AdminLayout user={user as any} title="WhatsApp টুল">
      <div className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10">
           <div className="bg-white p-6 md:p-10 rounded-[24px] md:rounded-[40px] border shadow-sm space-y-6">
              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">অর্ডার নির্বাচন করুন</label>
                 <select 
                    className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold outline-none appearance-none" 
                    value={selectedOrderId} 
                    onChange={e => setSelectedOrderId(e.target.value)}
                  >
                    <option value="">অর্ডার সিলেক্ট করুন...</option>
                    {orders.map(o => (
                      <option key={o.id} value={o.id}>{o.orderNo} - {customers.find(c => c.id === o.customerId)?.name}</option>
                    ))}
                 </select>
              </div>

              <div className="p-6 md:p-8 bg-green-50 rounded-2xl md:rounded-3xl border border-green-100 min-h-[160px] relative">
                 <p className="text-[10px] font-black text-green-600 uppercase tracking-widest mb-4">মেসেজ প্রিভিউ</p>
                 <p className="text-slate-700 font-bold whitespace-pre-wrap leading-relaxed text-sm md:text-base">{generateMessage()}</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-4">
                 <button onClick={copyToClipboard} className="flex-grow bg-slate-900 text-white px-6 py-4 rounded-2xl font-black shadow-xl hover:bg-slate-800 active:scale-95 transition-all flex items-center justify-center gap-2">
                   {copied ? <CheckCircle2 size={20} className="text-green-400" /> : <Copy size={20} />}
                   {copied ? 'কপি হয়েছে' : 'মেসেজ কপি করুন'}
                 </button>
                 <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" className="flex-grow bg-green-600 text-white px-6 py-4 rounded-2xl font-black shadow-xl hover:bg-green-700 active:scale-95 transition-all flex items-center justify-center gap-2">
                   <ExternalLink size={20} /> WhatsApp খুলুন
                 </a>
              </div>
           </div>

           <div className="bg-slate-900 p-6 md:p-10 rounded-[24px] md:rounded-[40px] text-white flex flex-col justify-center">
              <h3 className="text-xl font-black mb-6">দ্রুত গাইড</h3>
              <div className="space-y-6">
                 {[
                   "প্রথমে উপরে ড্রপডাউন থেকে নির্দিষ্ট অর্ডারটি সিলেক্ট করুন।",
                   "'মেসেজ কপি করুন' বাটনে ক্লিক করে টেক্সটটি কপি করে নিন।",
                   "সরাসরি WhatsApp-এ গিয়ে গ্রাহকের চ্যাট বক্সে পেস্ট (Paste) করুন।"
                 ].map((step, idx) => (
                   <div key={idx} className="flex gap-4 items-start">
                    <div className="bg-blue-600 w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shrink-0 mt-0.5">{idx + 1}</div>
                    <p className="text-slate-300 font-bold leading-relaxed">{step}</p>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminWhatsApp;
