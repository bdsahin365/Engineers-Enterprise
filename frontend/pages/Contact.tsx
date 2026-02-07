
import React from 'react';
import { MapPin, Phone, MessageSquare, Mail, Send } from 'lucide-react';
import { WHATSAPP_NUMBER } from '../constants';

const Contact: React.FC = () => {
  return (
    <div className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900 mb-6">আমাদের সাথে যোগাযোগ করুন</h1>
            <p className="text-lg text-slate-600 mb-10 leading-relaxed">
              যেকোনো পরামর্শ, অর্ডার বা পিলারের ডিজাইন নিয়ে আলোচনার জন্য আমাদের মেসেজ দিন বা সরাসরি কল করুন। আমরা সবসময় আপনার সেবায় নিয়োজিত।
            </p>

            <div className="space-y-8">
              <div className="flex items-start gap-6">
                <div className="bg-blue-100 p-4 rounded-2xl text-blue-600">
                  <MapPin size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg">কারখানা ও অফিস</h3>
                  <p className="text-slate-600">উত্তরা হাউজ বিল্ডিং এর পাশে, উত্তরা, ঢাকা-১২৩০।</p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="bg-green-100 p-4 rounded-2xl text-green-600">
                  <MessageSquare size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg">WhatsApp & IMO</h3>
                  <p className="text-slate-600">{WHATSAPP_NUMBER}</p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="bg-orange-100 p-4 rounded-2xl text-orange-600">
                  <Phone size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg">সরাসরি কথা বলুন</h3>
                  <p className="text-slate-600">প্রতিদিন সকাল ৯টা থেকে রাত ৯টা পর্যন্ত।</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-8 md:p-12 rounded-3xl border border-slate-100 shadow-sm">
            <h2 className="text-2xl font-bold mb-8">মেসেজ পাঠান</h2>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">নাম</label>
                  <input type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="আপনার নাম" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">মোবাইল নম্বর</label>
                  <input type="tel" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="০১৭XXXXXXXX" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">বার্তা</label>
                <textarea rows={4} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="আপনি কী জানতে চান?"></textarea>
              </div>
              <button type="button" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-100">
                <Send size={18} />
                মেসেজ পাঠান
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
