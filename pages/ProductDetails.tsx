
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Product } from '../types';
import { 
  MessageCircle, Phone, ArrowLeft, CheckCircle2, 
  Ruler, ChevronRight, ShieldCheck, Award, 
  Truck, CornerDownRight, Info, Star, Sparkles,
  Share2, Eye, MapPin, HardHat, FileText
} from 'lucide-react';
import { WHATSAPP_NUMBER } from '../constants';

interface Props {
  products: Product[];
}

const ProductDetails: React.FC<Props> = ({ products }) => {
  const { id } = useParams();
  const product = products.find(p => p.id === id);
  const [activeImage, setActiveImage] = useState(0);
  const [runningFeet, setRunningFeet] = useState(10);
  const [selectedTopId, setSelectedTopId] = useState('');
  const [selectedBottomId, setSelectedBottomId] = useState('');
  const [viewCount, setViewCount] = useState(Math.floor(Math.random() * 20) + 5);

  // Initial selection if none
  useEffect(() => {
    if (product?.isPillar && product.pillarConfig) {
        if (product.pillarConfig.tops.length > 0 && !selectedTopId) setSelectedTopId(product.pillarConfig.tops[0].id);
        if (product.pillarConfig.bottoms.length > 0 && !selectedBottomId) setSelectedBottomId(product.pillarConfig.bottoms[0].id);
    }
  }, [product, selectedTopId, selectedBottomId]);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center">
        <h2 className="text-2xl font-bold mb-4">প্রোডাক্ট পাওয়া যায়নি</h2>
        <Link to="/products" className="text-blue-600 font-bold">সব প্রোডাক্ট দেখুন</Link>
      </div>
    );
  }

  const selectedTop = product.pillarConfig?.tops.find(t => t.id === selectedTopId);
  const selectedBottom = product.pillarConfig?.bottoms.find(b => b.id === selectedBottomId);

  const calculateTotalPrice = () => {
    if (!product.isPillar || !product.pillarConfig) return product.price || 0;
    let total = 0;
    if (selectedTop) total += selectedTop.price;
    if (selectedBottom) total += selectedBottom.price;
    total += (product.pillarConfig.middlePricePerFoot * runningFeet);
    return total;
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Engineers Enterprise এর ${product.name} ডিজাইনটি দেখুন!`,
        url: window.location.href,
      });
    } else {
      alert("লিঙ্কটি কপি করে শেয়ার করুন: " + window.location.href);
    }
  };

  const whatsappMessage = encodeURIComponent(
    `আসসালামু আলাইকুম ইঞ্জিনিয়ার্স এন্টারপ্রাইজ,\n\nআমি এই প্রোডাক্টটি সম্পর্কে জানতে আগ্রহী:\n` +
    `পণ্য: ${product.name}\n` +
    `মডেল: ${product.modelNo}\n` +
    `${product.isPillar ? 
      `পিলারের মাপ: ${runningFeet} ফুট\n` +
      `টপ: ${selectedTop?.name || 'নেই'}\n` +
      `বেস: ${selectedBottom?.name || 'নেই'}\n` : 
      ""}\nমোট আনুমানিক মূল্য: ৳${calculateTotalPrice()}`
  );

  return (
    <div className="bg-slate-50 min-h-screen pb-24 md:pb-12">
      {/* Product Hero & Info Section */}
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-12">
        <div className="flex justify-between items-center mb-6">
          <Link to="/products" className="inline-flex items-center text-slate-500 hover:text-blue-600 font-bold transition-colors">
            <ArrowLeft size={18} className="mr-2" />
            সব কালেকশন
          </Link>
          <button onClick={handleShare} className="p-2.5 bg-white rounded-full shadow-sm text-slate-400 hover:text-blue-600 transition-colors">
            <Share2 size={20} />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16">
          {/* Left Column: Visuals */}
          <div className="space-y-6">
            <div className="aspect-square rounded-[40px] overflow-hidden border border-slate-100 shadow-2xl bg-white group relative">
              <img
                src={product.images[activeImage] || 'https://via.placeholder.com/600?text=No+Image'}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
              />
              <div className="absolute top-6 left-6 flex flex-col gap-2">
                <span className="bg-white/90 backdrop-blur px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest text-slate-900 shadow-xl border border-white">
                  {product.modelNo}
                </span>
                {product.isPillar && (
                   <span className="bg-blue-600 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-white shadow-xl">
                    Customizable
                  </span>
                )}
              </div>
              <div className="absolute bottom-6 left-6">
                <div className="bg-black/60 backdrop-blur-md text-white px-4 py-2 rounded-2xl text-[10px] font-black flex items-center gap-2">
                  <Eye size={14} className="text-blue-400" />
                  {viewCount} জন আজ এটি দেখেছেন
                </div>
              </div>
            </div>
            
            <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar px-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`w-20 h-20 md:w-28 md:h-28 rounded-3xl overflow-hidden border-4 transition-all shrink-0 ${
                    activeImage === idx ? 'border-blue-600 scale-105 shadow-xl' : 'border-white opacity-60 shadow-md'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Benefit Highlights */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: ShieldCheck, title: "মজবুত ও টেকসই", desc: "প্রিমিয়াম কংক্রিট", color: "text-blue-600", bg: "bg-blue-50" },
                { icon: Award, title: "নিখুঁত ফিনিশিং", desc: "অভিজ্ঞ কারিগর", color: "text-orange-600", bg: "bg-orange-50" },
                { icon: Truck, title: "সারাদেশে ডেলিভারি", desc: "নিরাপদ পরিবহন", color: "text-green-600", bg: "bg-green-50" },
                { icon: Sparkles, title: "মর্ডান ডিজাইন", desc: "আধুনিক লুক", color: "text-purple-600", bg: "bg-purple-50" },
              ].map((b, i) => (
                <div key={i} className={`${b.bg} p-4 md:p-5 rounded-3xl border border-white shadow-sm flex items-start gap-3 md:gap-4`}>
                   <div className={`${b.color} p-2 bg-white rounded-2xl shadow-sm`}><b.icon size={18} /></div>
                   <div>
                     <p className="font-black text-slate-900 text-xs md:text-sm">{b.title}</p>
                     <p className="text-[9px] md:text-[10px] font-bold text-slate-500 uppercase tracking-tighter">{b.desc}</p>
                   </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Pricing & Customization */}
          <div className="flex flex-col">
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
                <Star size={12} fill="currentColor" /> {product.category}
              </div>
              <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight leading-tight">{product.name}</h1>
              <p className="text-slate-500 text-lg font-medium leading-relaxed max-w-lg mb-6">
                {product.description}
              </p>
              
              <div className="flex items-center gap-4 py-4 border-y border-slate-100 mb-8">
                 <div className="flex -space-x-2">
                    {[1,2,3,4].map(i => <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 overflow-hidden shadow-sm"><img src={`https://i.pravatar.cc/100?u=${i+20}`} /></div>)}
                 </div>
                 <p className="text-xs font-bold text-slate-500">ঢাকা ও এর আশেপাশে ৫০০+ সফল প্রজেক্টে ব্যবহৃত।</p>
              </div>
            </div>

            {/* Pillar Customizer Card */}
            {product.isPillar && product.pillarConfig ? (
              <div className="bg-white rounded-[40px] shadow-2xl shadow-blue-900/5 border border-blue-50 overflow-hidden mb-10">
                <div className="bg-slate-900 p-6 text-white flex justify-between items-center">
                   <h3 className="text-lg font-black flex items-center gap-2 uppercase tracking-tight">
                    <Ruler size={24} className="text-blue-400" /> কনফিগার করুন
                   </h3>
                   <div className="bg-blue-600 px-3 py-1 rounded-full text-[10px] font-black">PREMIUM</div>
                </div>
                
                <div className="p-6 md:p-8 space-y-8">
                  {/* Part Selection */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-slate-900 mb-2">
                      <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
                      <h4 className="font-black text-sm uppercase tracking-widest">১. টপ ডিজাইন</h4>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {product.pillarConfig.tops.map(top => (
                        <button 
                          key={top.id}
                          onClick={() => setSelectedTopId(top.id)}
                          className={`group relative p-4 rounded-3xl border-2 text-left transition-all flex items-center gap-4 ${
                            selectedTopId === top.id ? 'border-blue-600 bg-blue-50/50 shadow-md scale-[1.02]' : 'border-slate-50 bg-slate-50 hover:bg-white hover:border-blue-200'
                          }`}
                        >
                          <div className="w-14 h-14 rounded-2xl overflow-hidden shrink-0 bg-white border border-slate-100 shadow-sm">
                            <img src={top.image || 'https://via.placeholder.com/100'} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                          </div>
                          <div>
                            <p className="font-black text-slate-900 text-xs md:text-sm leading-none mb-1">{top.name}</p>
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{top.height} • ৳{top.price}</p>
                          </div>
                          {selectedTopId === top.id && <div className="absolute top-2 right-2 text-blue-600"><CheckCircle2 size={16} fill="currentColor" className="text-white" /></div>}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-slate-900 mb-2">
                      <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
                      <h4 className="font-black text-sm uppercase tracking-widest">২. বেস ডিজাইন</h4>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {product.pillarConfig.bottoms.map(bottom => (
                        <button 
                          key={bottom.id}
                          onClick={() => setSelectedBottomId(bottom.id)}
                          className={`group relative p-4 rounded-3xl border-2 text-left transition-all flex items-center gap-4 ${
                            selectedBottomId === bottom.id ? 'border-blue-600 bg-blue-50/50 shadow-md scale-[1.02]' : 'border-slate-50 bg-slate-50 hover:bg-white hover:border-blue-200'
                          }`}
                        >
                          <div className="w-14 h-14 rounded-2xl overflow-hidden shrink-0 bg-white border border-slate-100 shadow-sm">
                            <img src={bottom.image || 'https://via.placeholder.com/100'} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                          </div>
                          <div>
                            <p className="font-black text-slate-900 text-xs md:text-sm leading-none mb-1">{bottom.name}</p>
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{bottom.height} • ৳{bottom.price}</p>
                          </div>
                          {selectedBottomId === bottom.id && <div className="absolute top-2 right-2 text-blue-600"><CheckCircle2 size={16} fill="currentColor" className="text-white" /></div>}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-6 pt-4 border-t border-slate-100">
                    <div className="flex justify-between items-end mb-4">
                      <div>
                        <h4 className="font-black text-sm uppercase tracking-widest text-slate-900 leading-none mb-1">৩. বডি রানিং ফুট</h4>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">৳{product.pillarConfig.middlePricePerFoot} / ফুট</p>
                      </div>
                      <span className="bg-slate-900 text-white px-4 py-1.5 rounded-2xl font-black text-sm shadow-lg">{runningFeet} ফুট</span>
                    </div>
                    <div className="relative h-6 flex items-center group/slider">
                       <input
                        type="range"
                        min="1"
                        max="40"
                        value={runningFeet}
                        onChange={(e) => setRunningFeet(parseInt(e.target.value))}
                        className="w-full h-2.5 bg-slate-100 rounded-full appearance-none cursor-pointer accent-blue-600 group-hover/slider:bg-blue-50 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Summary Box */}
                  <div className="bg-blue-600 rounded-[32px] p-6 md:p-8 text-white shadow-2xl relative overflow-hidden group">
                    <div className="absolute -right-10 -top-10 opacity-10 group-hover:scale-125 transition-transform duration-1000 rotate-12"><Ruler size={150} /></div>
                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
                      <div className="text-center md:text-left">
                        <p className="text-[10px] font-black uppercase text-blue-200 tracking-[0.2em] mb-1">সর্বমোট আনুমানিক মূল্য</p>
                        <p className="text-5xl md:text-6xl font-black text-white leading-none">৳{calculateTotalPrice().toLocaleString()}</p>
                      </div>
                      <div className="hidden md:block h-16 w-px bg-white/20"></div>
                      <div className="space-y-1.5 text-center md:text-right text-[10px] font-bold text-blue-100 tracking-wide">
                        <p className="flex items-center justify-center md:justify-end gap-2 uppercase">{selectedTop?.name || 'টপ ছাড়া'} <CornerDownRight size={10} /></p>
                        <p className="flex items-center justify-center md:justify-end gap-2 uppercase">{runningFeet} ফুট বডি (৳{product.pillarConfig.middlePricePerFoot * runningFeet}) <CornerDownRight size={10} /></p>
                        <p className="flex items-center justify-center md:justify-end gap-2 uppercase">{selectedBottom?.name || 'বেস ছাড়া'} <CornerDownRight size={10} /></p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-[40px] p-10 border border-slate-100 shadow-xl flex items-center justify-between mb-10">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">প্রতি পিস মূল্য</p>
                  <p className="text-6xl font-black text-slate-900 leading-none">৳{product.price}</p>
                </div>
                <div className="bg-green-50 p-6 rounded-[32px] text-green-600 shadow-inner">
                   <ShieldCheck size={48} strokeWidth={1.5} />
                </div>
              </div>
            )}

            {/* Technical Specifications */}
            <div className="mb-10 p-6 md:p-8 bg-slate-900 text-white rounded-[40px] shadow-xl">
               <h4 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                 <FileText size={18} className="text-blue-400" /> টেকনিক্যাল স্পেসিফিকেশন
               </h4>
               <div className="grid grid-cols-2 gap-y-4 text-xs">
                  <div className="text-slate-400 font-bold uppercase">ম্যাটেরিয়াল</div>
                  <div className="text-white font-black">হাই-গ্রেড কংক্রিট (পাথর ঢালাই)</div>
                  <div className="text-slate-400 font-bold uppercase">ফিনিশিং</div>
                  <div className="text-white font-black">স্মুথ অ্যান্ড প্রিমিয়াম</div>
                  <div className="text-slate-400 font-bold uppercase">স্থায়িত্ব</div>
                  <div className="text-white font-black">৫০+ বছর</div>
                  <div className="text-slate-400 font-bold uppercase">ব্যবহার</div>
                  <div className="text-white font-black">আউটডোর ও ইনডোর</div>
               </div>
            </div>

            {/* Desktop CTAs */}
            <div className="hidden md:grid grid-cols-2 gap-4">
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`}
                className="flex items-center justify-center gap-3 bg-green-600 hover:bg-green-700 text-white px-8 py-5 rounded-[28px] text-lg font-black transition-all shadow-2xl shadow-green-600/20 active:scale-95"
              >
                <MessageCircle size={24} />
                <span>WhatsApp এ অর্ডার</span>
              </a>
              <a
                href={`tel:${WHATSAPP_NUMBER}`}
                className="flex items-center justify-center gap-3 bg-slate-900 hover:bg-slate-800 text-white px-8 py-5 rounded-[28px] text-lg font-black transition-all shadow-2xl shadow-slate-900/10 active:scale-95"
              >
                <Phone size={24} />
                <span>সরাসরি কল দিন</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose Us & Process Section */}
      <div className="bg-white py-16 md:py-24 mt-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4">কেন আমরা <span className="text-blue-600 underline decoration-4 decoration-blue-100 underline-offset-8">সেরা?</span></h2>
            <p className="text-slate-500 font-bold">গুণগত মান এবং বিশ্বস্ততাই আমাদের মূল পুঁজি।</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
               <div className="space-y-6">
                 {[
                   { step: "১", title: "সঠিক ডিজাইন নির্বাচন", desc: "উপরে দেওয়া অপশন থেকে আপনার পছন্দের ডিজাইন ও মাপ বেছে নিন।" },
                   { step: "২", title: "WhatsApp চ্যাট", desc: "নীচের বাটনে ক্লিক করে আমাদের এক্সপার্টের সাথে আলোচনা করুন।" },
                   { step: "৩", title: "নিরাপদ শিপিং", desc: "অর্ডার কনফার্ম করার পর আমরা সারাদেশে পণ্য পৌঁছে দেই।" },
                   { step: "৪", title: "সহজ পেমেন্ট", desc: "ডেলিভারি পাওয়ার পর বা আলোচনার ভিত্তিতে পেমেন্ট সম্পন্ন করুন।" },
                 ].map((s, idx) => (
                   <div key={idx} className="flex gap-6 group">
                     <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center font-black text-blue-600 text-xl shadow-sm border border-slate-100 group-hover:bg-blue-600 group-hover:text-white transition-all">
                       {s.step}
                     </div>
                     <div>
                       <h4 className="font-black text-slate-900 mb-1 text-lg">{s.title}</h4>
                       <p className="text-sm font-medium text-slate-500 leading-relaxed">{s.desc}</p>
                     </div>
                   </div>
                 ))}
               </div>
               
               <div className="p-6 bg-blue-50 rounded-3xl border border-blue-100 flex items-start gap-4">
                  <HardHat className="text-blue-600 shrink-0 mt-0.5" />
                  <p className="text-xs font-bold text-blue-900 leading-relaxed">
                    আমাদের নিজস্ব অভিজ্ঞ টিম দিয়ে ইনস্টলেশন বা ফিটিংয়ের পরামর্শ দেওয়া হয়। বিস্তারিত জানতে কল করুন।
                  </p>
               </div>
            </div>

            <div className="relative grid grid-cols-2 gap-4">
               <div className="space-y-4 pt-12">
                 <div className="aspect-[3/4] rounded-[40px] overflow-hidden shadow-2xl border-4 border-white"><img src="https://images.unsplash.com/photo-1541888946425-d81bb19480c5?auto=format&fit=crop&q=80&w=600" className="w-full h-full object-cover" /></div>
                 <div className="bg-slate-900 p-8 rounded-[40px] text-white shadow-xl flex flex-col items-center justify-center text-center">
                    <ShieldCheck size={40} className="mb-4 text-blue-400" />
                    <p className="text-sm font-black leading-tight uppercase tracking-widest">১০০% গ্যারান্টি</p>
                 </div>
               </div>
               <div className="space-y-4">
                  <div className="bg-blue-600 p-8 rounded-[40px] text-white shadow-xl flex flex-col items-center justify-center text-center">
                    <p className="text-3xl font-black mb-1">১২+</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-blue-100">বছরের অভিজ্ঞতা</p>
                  </div>
                  <div className="aspect-[3/4] rounded-[40px] overflow-hidden shadow-2xl border-4 border-white"><img src="https://images.unsplash.com/photo-1590644365607-1c5a519a7a37?auto=format&fit=crop&q=80&w=600" className="w-full h-full object-cover" /></div>
               </div>
               {/* Decorative elements */}
               <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-100 -z-10 rounded-full blur-3xl opacity-50"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Bottom Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-slate-100 p-4 z-[50] shadow-[0_-10px_30px_rgba(0,0,0,0.1)] flex gap-3 animate-in slide-in-from-bottom duration-500">
        <a
          href={`tel:${WHATSAPP_NUMBER}`}
          className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-900 active:scale-95 transition-all shadow-inner"
        >
          <Phone size={24} />
        </a>
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`}
          className="flex-grow bg-green-600 hover:bg-green-700 text-white rounded-2xl flex items-center justify-center gap-3 font-black text-sm active:scale-95 transition-all shadow-xl shadow-green-600/20"
        >
          <MessageCircle size={22} />
          <span>অর্ডার করুন</span>
        </a>
      </div>
    </div>
  );
};

export default ProductDetails;
