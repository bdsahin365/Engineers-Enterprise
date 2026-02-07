
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Product } from '../types';
import {
  MessageCircle, Phone, ArrowLeft, Star,
  Share2, HardHat
} from 'lucide-react';
import { WHATSAPP_NUMBER } from '../constants';
import { api } from '../api';
import BenefitHighlights from '../components/BenefitHighlights';
import TechnicalSpecs from '../components/TechnicalSpecs';
import PillarCustomizer from '../components/PillarCustomizer';
import ProductVisuals from '../components/ProductVisuals';

interface Props {
  products: Product[];
}

const ProductDetails: React.FC<Props> = ({ products: initialProducts }) => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [globalData, setGlobalData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [runningFeet, setRunningFeet] = useState(10);
  const [selectedTopId, setSelectedTopId] = useState('');
  const [selectedBottomId, setSelectedBottomId] = useState('');
  const [viewCount, setViewCount] = useState(Math.floor(Math.random() * 20) + 5);

  const [showStickyHeader, setShowStickyHeader] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowStickyHeader(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchGlobal = async () => {
      try {
        const data = await api.getGlobal();
        if (data) setGlobalData(data);
      } catch (err) {
        console.error("Failed to fetch global data:", err);
      }
    };
    fetchGlobal();
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;

      // Optimistic check: if we already have it in the list from App.tsx, show it immediately
      if (initialProducts.length > 0) {
        const found = initialProducts.find(p => p.id === id);
        if (found) {
          setProduct(found);
          setLoading(false);
        }
      }

      setLoading(true);
      setError(false);
      try {
        const data = await api.getProduct(id);
        if (data) {
          setProduct(data);
          setError(false);
        } else {
          if (!product) setError(true);
        }
      } catch (err) {
        console.error("Failed to fetch product detail from API:", err);
        if (!product) setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    window.scrollTo(0, 0); // Scroll to top on ID change
  }, [id, initialProducts]);

  // Initial selection if none
  useEffect(() => {
    if (product?.isPillar && product.pillarConfig) {
      if (product.pillarConfig.tops?.length > 0 && !selectedTopId) setSelectedTopId(product.pillarConfig.tops[0].id);
      if (product.pillarConfig.bottoms?.length > 0 && !selectedBottomId) setSelectedBottomId(product.pillarConfig.bottoms[0].id);
    }
  }, [product, selectedTopId, selectedBottomId]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-6 shadow-xl"></div>
        <p className="font-black text-slate-400 uppercase tracking-widest text-sm">প্রোডাক্ট লোড হচ্ছে...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center">
        <div className="mb-8 p-10 bg-white rounded-[40px] shadow-2xl inline-block">
          <HardHat size={64} className="text-slate-200 mx-auto mb-6" />
          <h2 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">প্রোডাক্ট পাওয়া যায়নি</h2>
          <p className="text-slate-500 font-bold mb-8">দয়া করে অন্য কোনো ডিজাইন দেখুন</p>
          <Link to="/products" className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black shadow-xl hover:bg-slate-900 transition-all">সব কালেকশন দেখুন</Link>
        </div>
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

  const relatedProducts = initialProducts
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="bg-slate-50 min-h-screen pb-24 md:pb-12">
      {/* Sticky Quick Actions Header */}
      <div className={`fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-b border-slate-100 z-[60] py-3 px-4 transition-all duration-500 shadow-xl ${showStickyHeader ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'}`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-slate-50 overflow-hidden shrink-0 border border-slate-100 hidden sm:block">
              <img src={product.images?.[0] || 'https://via.placeholder.com/100'} className="w-full h-full object-cover" />
            </div>
            <div>
              <h4 className="font-black text-slate-900 text-xs sm:text-sm truncate w-32 sm:w-auto uppercase tracking-tight">{product.name}</h4>
              <p className="text-[10px] font-black text-blue-600">৳{calculateTotalPrice().toLocaleString()}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a href={`tel:${WHATSAPP_NUMBER}`} className="p-2 sm:p-3 bg-slate-100 text-slate-900 rounded-xl hover:bg-slate-200 transition-all"><Phone size={18} /></a>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`}
              className="bg-green-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-black text-[10px] sm:text-xs shadow-lg shadow-green-600/20 active:scale-95 transition-all flex items-center gap-2"
            >
              <MessageCircle size={16} /> <span>অর্ডার করুন</span>
            </a>
          </div>
        </div>
      </div>

      {/* Product Hero & Info Section */}
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-12">
        <div className="flex justify-between items-center mb-8">
          <Link to="/products" className="group flex items-center gap-3 text-slate-500 hover:text-blue-600 transition-all">
            <div className="w-10 h-10 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
              <ArrowLeft size={18} />
            </div>
            <span className="font-black uppercase tracking-widest text-[10px]">সব কালেকশন</span>
          </Link>
          <div className="flex gap-2">
            <button onClick={handleShare} className="w-10 h-10 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center text-slate-400 hover:text-blue-600 transition-all">
              <Share2 size={18} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-20">
          {/* Left Column: Visuals */}
          <div className="space-y-10">
            <ProductVisuals
              product={product}
              activeImage={activeImage}
              setActiveImage={setActiveImage}
              viewCount={viewCount}
            />
            <BenefitHighlights />
            <TechnicalSpecs />
          </div>

          {/* Right Column: Pricing & Customization */}
          <div className="flex flex-col">
            <div className="mb-10">
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                <Star size={12} fill="currentColor" /> {product.category}
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tighter leading-[0.9] uppercase">{product.name}</h1>
              <p className="text-slate-500 text-lg font-bold leading-relaxed max-w-lg mb-10 border-l-4 border-blue-600 pl-6 py-2">
                {product.description}
              </p>

              <div className="flex items-center gap-5 py-6 border-y border-slate-100 mb-10">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4, 5].map(i => <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden shadow-md"><img src={`https://i.pravatar.cc/100?u=${i + 40}`} alt="" /></div>)}
                </div>
                <div>
                  <div className="flex items-center gap-1 text-yellow-400 mb-0.5">
                    {[1, 2, 3, 4, 5].map(i => <Star key={i} size={14} fill="currentColor" />)}
                  </div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">৫০০+ সফল প্রজেক্টে ব্যবহৃত।</p>
                </div>
              </div>
            </div>

            {/* Pillar Customizer Card */}
            {product.isPillar && product.pillarConfig ? (
              <PillarCustomizer
                product={product}
                runningFeet={runningFeet}
                setRunningFeet={setRunningFeet}
                selectedTopId={selectedTopId}
                setSelectedTopId={setSelectedTopId}
                selectedBottomId={selectedBottomId}
                setSelectedBottomId={setSelectedBottomId}
                calculateTotalPrice={calculateTotalPrice}
              />
            ) : (
              <div className="bg-white rounded-[40px] p-10 md:p-12 border border-slate-100 shadow-2xl flex items-center justify-between mb-10 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 blur-3xl rounded-full translate-x-16 -translate-y-16 group-hover:bg-blue-600/10 transition-colors"></div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">প্রতি পিস মূল্য</p>
                  <p className="text-7xl font-black text-slate-900 leading-none tracking-tighter">৳{product.price?.toLocaleString()}</p>
                </div>
                <div className="bg-blue-600/5 p-8 rounded-[40px] text-blue-600 shadow-inner group-hover:scale-110 transition-transform">
                  <HardHat size={56} strokeWidth={1} />
                </div>
              </div>
            )}

            {/* Desktop CTAs */}
            <div className="hidden md:grid grid-cols-2 gap-5 mt-4">
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`}
                className="flex flex-col items-center justify-center gap-1 bg-green-600 hover:bg-green-700 text-white px-8 py-6 rounded-[32px] transition-all shadow-2xl shadow-green-600/30 active:scale-95 group"
              >
                <div className="flex items-center gap-3 font-black text-xl mb-1">
                  <MessageCircle size={24} /> <span>WhatsApp মেসেজ</span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-80 group-hover:opacity-100 transition-opacity">দ্রুত রেসপন্স এনশিউর করি</span>
              </a>
              <a
                href={`tel:${WHATSAPP_NUMBER}`}
                className="flex flex-col items-center justify-center gap-1 bg-slate-900 hover:bg-slate-800 text-white px-8 py-6 rounded-[32px] transition-all shadow-2xl shadow-slate-900/10 active:scale-95 group"
              >
                <div className="flex items-center gap-3 font-black text-xl mb-1">
                  <Phone size={24} /> <span>সরাসরি কল দিন</span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-80 group-hover:opacity-100 transition-opacity">সকাল ৯টা - রাত ১০টা</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose Us & Process Section */}
      <div className="bg-white py-24 md:py-32 mt-20 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-slate-50/50 -skew-y-3 origin-top-left -z-10"></div>
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-24 max-w-2xl mx-auto">
            <span className="bg-blue-100 text-blue-600 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-4 inline-block">ENGINEERS CHOICE</span>
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight">{globalData?.whyChooseUsTitle || 'কেন আমরা সেরা?'}</h2>
            <p className="text-slate-500 font-bold leading-relaxed">{globalData?.whyChooseUsSubtitle || '১২ বছরের অভিজ্ঞতা এবং ১০০০+ সফল প্রজেক্টের অভিজ্ঞতা নিয়ে আমরা আপনাদের সেবায় নিয়োজিত।'}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-12">
              <div className="text-left mb-10">
                <h4 className="font-black text-2xl uppercase tracking-tight text-slate-900 mb-2">{globalData?.howToOrderTitle || 'কীভাবে অর্ডার করবেন?'}</h4>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{globalData?.howToOrderSubtitle || 'সহজ ৪টি ধাপে আপনার পছন্দের পণ্যটি অর্ডার করুন'}</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {(globalData?.howToOrderSteps?.length > 0 ? globalData.howToOrderSteps : [
                  { title: "সঠিক ডিজাইন নির্বাচন", description: "আমাদের শত শত কালেকশন থেকে আপনার বাড়ির সাথে মানানসই ডিজাইনটি বেছে নিন।" },
                  { title: "মেজারমেন্ট ও এস্টিমেট", description: "আমরা নিখুঁতভাবে আপনার প্রোজেক্ট সাইজ অনুযায়ী টাকার হিসাব করে দিব।" },
                  { title: "দ্রুত শিপিং সুবিধা", description: "সারা বাংলাদেশে ৭২ ঘণ্টার মধ্যে আমরা পণ্য পৌঁছে দেওয়ার চেষ্টা করি।" },
                  { title: "ইনস্টলেশন সাপোর্ট", description: "পণ্য পাওয়ার পর ফিটিং নিয়ে কোনো সমস্যার সম্মুখীন হলে আমাদের এক্সপার্টরা গাইড করবেন।" },
                ]).map((s: any, idx: number) => (
                  <div key={idx} className="p-8 bg-slate-50 rounded-[40px] border border-slate-100 hover:border-blue-200 transition-all group">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center font-black text-blue-600 text-xl shadow-sm mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all">
                      {idx + 1}
                    </div>
                    <h4 className="font-black text-slate-900 mb-2 text-lg uppercase tracking-tight">{s.title}</h4>
                    <p className="text-xs font-bold text-slate-500 leading-relaxed">{s.description || s.desc}</p>
                  </div>
                ))}
              </div>

              <div className="p-8 bg-slate-900 rounded-[40px] text-white flex items-start gap-5 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 blur-3xl rounded-full"></div>
                <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center shrink-0">
                  <HardHat className="text-white" size={24} />
                </div>
                <div>
                  <p className="text-sm font-black mb-1 uppercase tracking-widest text-blue-400">এক্সপার্ট কনসালটেন্সি</p>
                  <p className="text-xs font-bold text-slate-300 leading-relaxed">
                    আপনার বাড়ি বা ভবনের ডিজাইনের সাথে কোনটি বেশি মানানসই হবে তা জানতে আমাদের সাথে ফ্রি পরামর্শ করতে পারেন।
                  </p>
                </div>
              </div>
            </div>

            <div className="relative grid grid-cols-2 gap-5">
              <div className="space-y-5 pt-16">
                <div className="aspect-[3/4] rounded-[50px] overflow-hidden shadow-2xl border-8 border-white group"><img src="https://images.unsplash.com/photo-1541888946425-d81bb19480c5?auto=format&fit=crop&q=80&w=600" alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" /></div>
                <div className="bg-slate-900 p-10 rounded-[50px] text-white shadow-2xl flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg rotate-3"><Star size={32} className="text-white" fill="currentColor" /></div>
                  <p className="text-xs font-black leading-tight uppercase tracking-[0.2em] text-blue-400 mb-1">PREMIUM QUALITY</p>
                  <p className="text-lg font-black tracking-tight leading-none uppercase">ISO সার্টিফাইড মান</p>
                </div>
              </div>
              <div className="space-y-5">
                <div className="bg-white p-10 rounded-[50px] text-slate-900 shadow-2xl flex flex-col items-center justify-center text-center border border-slate-100">
                  <p className="text-6xl font-black mb-2 text-blue-600 tracking-tighter">১২+</p>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">বছরের শ্রেষ্ঠত্ব</p>
                </div>
                <div className="aspect-[3/4] rounded-[50px] overflow-hidden shadow-2xl border-8 border-white group"><img src="https://images.unsplash.com/photo-1590644365607-1c5a519a7a37?auto=format&fit=crop&q=80&w=600" alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" /></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 py-24">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tight">আপনার আরও <span className="text-blue-600">পছন্দ হতে পারে</span></h3>
              <p className="text-sm font-bold text-slate-400 mt-2 uppercase tracking-widest">{product.category} ক্যাটাগরির সেরা ডিজাইনগুলো</p>
            </div>
            <Link to="/products" className="text-xs font-black text-blue-600 hover:text-slate-900 transition-all uppercase tracking-widest underline decoration-2 underline-offset-4">সবগুলো দেখুন</Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map(rp => (
              <Link key={rp.id} to={`/product/${rp.id}`} className="group block h-full">
                <div className="bg-white rounded-[32px] overflow-hidden border border-slate-100 shadow-lg hover:shadow-2xl hover:border-blue-200 transition-all h-full flex flex-col">
                  <div className="aspect-square overflow-hidden bg-slate-50 relative">
                    <img src={rp.images?.[0] || 'https://via.placeholder.com/400'} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                    {rp.price && <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-xl text-xs font-black text-slate-900 shadow-sm">৳{rp.price}</div>}
                  </div>
                  <div className="p-6 flex-grow flex flex-col justify-between">
                    <h4 className="font-black text-slate-900 text-sm leading-tight mb-2 truncate group-hover:text-blue-600 transition-colors uppercase tracking-tight">{rp.name}</h4>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{rp.category}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Mobile Sticky Bottom Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-slate-100 p-4 z-[50] shadow-[0_-10px_30px_rgba(0,0,0,0.1)] flex gap-3 animate-in slide-in-from-bottom duration-500">
        <a
          href={`tel:${WHATSAPP_NUMBER}`}
          className="w-16 h-16 bg-slate-100 rounded-3xl flex items-center justify-center text-slate-900 active:scale-95 transition-all shadow-inner"
        >
          <Phone size={24} />
        </a>
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`}
          className="flex-grow bg-green-600 hover:bg-green-700 text-white rounded-3xl flex items-center justify-center gap-3 font-black text-sm active:scale-95 transition-all shadow-xl shadow-green-600/20"
        >
          <MessageCircle size={22} />
          <span>WhatsApp এ অর্ডার দিন</span>
        </a>
      </div>
    </div>
  );
};

export default ProductDetails;

