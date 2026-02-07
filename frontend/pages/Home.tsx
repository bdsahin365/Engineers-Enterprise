
import React from 'react';
import { Link } from 'react-router-dom';
import {
  MessageCircle, Phone, ArrowRight, ShieldCheck, Star,
  Construction, CheckCircle2, Ruler, Layout, Sparkles,
  Award, HeartHandshake, Zap, ChevronRight, Truck, Shield, Clock, ArrowUpRight
} from 'lucide-react';
import { Category, HomepageData, CategoryItem } from '../types';
import { WHATSAPP_NUMBER, IMO_NUMBER, MOCK_PRODUCTS } from '../constants';
import { api } from '../api';
import * as LucideIcons from 'lucide-react';
import Skeleton from '../components/ui/Skeleton';
import DynamicIcon from '../components/DynamicIcon';

const Home: React.FC = () => {
  const [homepageData, setHomepageData] = React.useState<HomepageData | null>(null);
  const [categories, setCategories] = React.useState<CategoryItem[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [home, cats] = await Promise.all([
          api.getHomepage(),
          api.getCategories()
        ]);
        setHomepageData(home);
        setCategories(cats);
      } catch (error) {
        console.error("Failed to fetch home data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        {/* Hero Skeleton */}
        <div className="relative h-[600px] md:h-[700px] bg-slate-100 overflow-hidden">
          <div className="absolute inset-0 bg-slate-200 animate-pulse"></div>
          <div className="relative container mx-auto px-6 h-full flex flex-col justify-center">
            <Skeleton className="h-12 w-3/4 md:w-1/2 mb-4 bg-slate-300" />
            <Skeleton className="h-6 w-1/2 md:w-1/3 mb-8 bg-slate-300" />
            <Skeleton className="h-14 w-40 rounded-full bg-slate-300" />
          </div>
        </div>

        {/* Categories Skeleton */}
        <div className="py-16 bg-slate-50">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-32 w-full rounded-3xl" />)}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const featuredProduct = homepageData?.featuredProduct || MOCK_PRODUCTS[0];
  const heroTitle = homepageData?.heroTitle || "ডেকোরেটিভ কংক্রিট পিলার ও বিল্ডিং ডিজাইন";
  const heroSubtitle = homepageData?.heroSubtitle || "মজবুত, টেকসই ও প্রিমিয়াম কংক্রিট কাজ।";

  // Use CMS categories if available, otherwise fall back to enum
  const displayCategories = categories.length > 0
    ? categories
    : Object.values(Category).map((cat, idx) => ({
      id: idx.toString(),
      name: cat,
      slug: cat,
      description: "প্রিমিয়াম কোয়ালিটি ডেকোরেশন",
      icon: "Layout"
    }));

  const whatsapp = homepageData?.whatsappNumber || WHATSAPP_NUMBER;
  const imo = homepageData?.imoNumber || IMO_NUMBER;


  const orderSteps = [
    { title: "পছন্দের পণ্য দেখুন", desc: "আমাদের গ্যালারি থেকে আপনার পছন্দের ডিজাইনটি বাছাই করুন।", icon: Layout },
    { title: "সরাসরি যোগাযোগ", desc: "WhatsApp বা IMO-তে আমাদের সাথে কথা বলে বিস্তারিত জেনে নিন।", icon: MessageCircle },
    { title: "মাপ ও পরিমাণ", desc: "আপনার প্রয়োজনীয় সাইজ এবং কত পিস লাগবে তা আমাদের জানান।", icon: Ruler },
    { title: "অর্ডার সম্পন্ন", desc: "দাম এবং ডেলিভারি সময় কনফার্ম করে অর্ডারটি নিশ্চিত করুন।", icon: CheckCircle2 }
  ];

  console.log("Rendering Home Component"); // DEBUG
  return (
    <div className="pb-20 md:pb-0">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center bg-slate-900 text-white overflow-hidden pt-10">
        <div className="absolute inset-0 opacity-40">
          <img
            src="https://images.unsplash.com/photo-1541888946425-d81bb19480c5?auto=format&fit=crop&q=80&w=1920"
            alt="Construction background"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/80 to-transparent"></div>

        <div className="max-w-7xl mx-auto px-4 relative z-10 py-16">
          <div className="max-w-2xl space-y-8 animate-in slide-in-from-left duration-1000">
            <div className="inline-flex items-center gap-2 bg-blue-600/20 border border-blue-500/30 px-4 py-2 rounded-full backdrop-blur-md">
              <Sparkles size={16} className="text-blue-400" />
              <span className="text-xs font-black uppercase tracking-widest text-blue-300">বাংলাদেশি পরিবেশ উপযোগী ডিজাইন</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-[1.1] tracking-tight">
              {heroTitle.split(' ').map((word, i) =>
                word.includes('পিলার') ? <span key={i} className="text-blue-500 block md:inline">{word} </span> : word + " "
              )}
            </h1>

            <p className="text-lg md:text-2xl text-slate-300 leading-relaxed font-medium">
              {heroSubtitle} <br className="hidden md:block" />
              <span className="text-slate-400 font-normal">Porch Pillar • Fancy Block • Baluster • Roof Cornice</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <a
                href={`https://wa.me/${whatsapp}`}
                className="group flex items-center justify-center space-x-3 bg-green-600 hover:bg-green-700 text-white px-8 py-5 rounded-2xl text-lg font-black transition-all shadow-2xl shadow-green-600/20 active:scale-95"
              >
                <MessageCircle size={24} className="group-hover:rotate-12 transition-transform" />
                <span>WhatsApp এ অর্ডার করুন</span>
              </a>
              <a
                href={`tel:${imo}`}
                className="flex items-center justify-center space-x-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-8 py-5 rounded-2xl text-lg font-black backdrop-blur-md transition-all active:scale-95"
              >
                <MessageCircle size={24} className="text-blue-400" />
                <span>IMO এ যোগাযোগ</span>
              </a>
            </div>

            <div className="flex items-center gap-6 pt-6 border-t border-white/10 opacity-70">
              <div className="text-xs font-bold uppercase tracking-tighter flex items-center gap-2">
                <CheckCircle2 size={14} className="text-blue-500" /> নিজস্ব কারখানায় তৈরি
              </div>
              <div className="text-xs font-bold uppercase tracking-tighter flex items-center gap-2">
                <CheckCircle2 size={14} className="text-blue-500" /> দীর্ঘস্থায়ী স্থায়িত্ব
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-xl">
              <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">আমাদের পণ্যসমূহ</h2>
              <p className="text-slate-500 text-lg font-medium leading-relaxed">
                বাড়ি, বারান্দা ও বিল্ডিংয়ের সৌন্দর্য বাড়াতে আমাদের রয়েছে বিভিন্ন ডেকোরেটিভ কংক্রিট পণ্য। সেরা ডিজাইনের গ্যারান্টি।
              </p>
            </div>
            <Link to="/products" className="group flex items-center gap-2 text-blue-600 font-black text-lg hover:gap-4 transition-all">
              সব পণ্য দেখুন <ArrowRight size={20} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayCategories.map((cat, idx) => (
              <Link
                to={`/products?category=${cat.slug}`}
                key={idx}
                className="group relative bg-slate-50 rounded-[32px] p-8 overflow-hidden hover:bg-blue-600 transition-all duration-500 shadow-sm border border-slate-100 hover:shadow-2xl hover:shadow-blue-600/20"
              >
                <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 group-hover:scale-150 transition-all duration-700">
                  <Construction size={120} />
                </div>
                <div className="bg-white w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-md group-hover:bg-blue-500 group-hover:text-white transition-colors">
                  <DynamicIcon name={cat.icon || "Layout"} className="text-blue-600 group-hover:text-white" size={28} />
                </div>
                <h3 className="font-black text-xl leading-tight text-slate-900 group-hover:text-white mb-2">{cat.name}</h3>
                <p className="text-slate-400 text-sm group-hover:text-blue-100 mb-6 font-medium">{cat.description || "প্রিমিয়াম কোয়ালিটি ডেকোরেশন"}</p>
                <div className="text-blue-600 group-hover:text-white inline-flex items-center text-sm font-black uppercase tracking-widest">
                  সংগ্রহ দেখুন <ArrowRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Product Section */}
      <section className="py-24 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white rounded-[48px] overflow-hidden shadow-2xl border border-slate-100 flex flex-col lg:flex-row items-stretch">
            <div className="lg:w-1/2 aspect-square lg:aspect-auto">
              <img
                src={featuredProduct.images[0]}
                alt={featuredProduct.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="lg:w-1/2 p-10 md:p-16 flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest mb-6">
                <Star size={14} fill="currentColor" /> জনপ্রিয় পণ্য
              </div>
              <h2 className="text-4xl font-black text-slate-900 mb-4">{featuredProduct.name}</h2>
              <div className="text-slate-400 font-mono text-sm mb-6">Model: {featuredProduct.modelNo}</div>
              <p className="text-slate-600 text-lg leading-relaxed mb-8 font-medium">
                ডেকোরেটিভ পোরচ পিলার – Top, Middle ও Bottom আলাদা ভাবে পাওয়া যায়। Middle অংশ রানিং ফুট অনুযায়ী কাস্টম করা সম্ভব। আমাদের নিখুঁত ফিনিশিং আপনার বাড়ির লুকে পরিবর্তন নিয়ে আসবে।
              </p>

              <div className="space-y-4 mb-10">
                <div className="flex items-center gap-3 text-slate-700 font-bold">
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center"><CheckCircle2 size={16} /></div>
                  হাই-গ্রেড কংক্রিট ম্যাটেরিয়াল
                </div>
                <div className="flex items-center gap-3 text-slate-700 font-bold">
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center"><CheckCircle2 size={16} /></div>
                  কাস্টমাইজড সাইজ অপশন
                </div>
              </div>

              <Link
                to={`/products/${featuredProduct.id}`}
                className="bg-slate-900 text-white px-10 py-5 rounded-2xl font-black text-lg shadow-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-3 active:scale-95"
              >
                পণ্যের বিস্তারিত দেখুন <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Engineers Enterprise */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-black text-slate-900 mb-4">কেন Engineers Enterprise বেছে নেবেন?</h2>
            <p className="text-slate-500 font-medium max-w-2xl mx-auto text-lg">আমরা সুন্দর ডিজাইনের পাশাপাশি গুণগত মানকে সবচেয়ে বেশি গুরুত্ব দিই।</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
              { title: "নিজস্ব কারখানায় উৎপাদন", icon: Construction, desc: "নিজেদের কন্ট্রোলে তৈরি হয় বিধায় আমরা কোয়ালিটি নিয়ে নিশ্চিত থাকি।" },
              { title: "শক্ত ও টেকসই কংক্রিট", icon: ShieldCheck, desc: "উন্নত মানের সিমেন্ট ও পাথর ব্যবহারে আমরা কোনো আপোষ করি না।" },
              { title: "অভিজ্ঞ কারিগরের কাজ", icon: Award, desc: "দীর্ঘ এক দশকের অভিজ্ঞ কারিগরদের নিপুণ হাতের নিখুঁত ফিনিশিং।" },
              { title: "কাস্টম ডিজাইন সুবিধা", icon: Ruler, desc: "আপনার বাড়ির স্থাপত্য অনুযায়ী ডিজাইন কাস্টমাইজ করার সুবিধা।" },
              { title: "যুক্তিসঙ্গত দাম", icon: Zap, desc: "সরাসরি কারখানা থেকে সরবরাহ করায় আমরা সাশ্রয়ী মূল্য দিতে পারি।" },
              { title: "বিশ্বস্ত সার্ভিস", icon: HeartHandshake, desc: "অর্ডার থেকে ডেলিভারি পর্যন্ত প্রতিটি পদক্ষেপে আমরা বিশ্বস্ত।" }
            ].map((item, idx) => (
              <div key={idx} className="flex gap-6 p-8 bg-slate-50 rounded-3xl hover:bg-white hover:shadow-xl transition-all group">
                <div className="bg-white p-4 rounded-2xl text-blue-600 shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-all h-fit">
                  <item.icon size={28} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-black text-slate-900 leading-tight">{item.title}</h3>
                  <p className="text-slate-500 font-medium leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to Order */}
      <section className="py-24 bg-slate-900 text-white rounded-[60px] mx-4 mb-10 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 blur-[100px] -z-10"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/10 blur-[100px] -z-10"></div>

        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-black mb-4">কিভাবে অর্ডার করবেন?</h2>
            <p className="text-slate-400 font-medium">সরাসরি আলোচনার মাধ্যমে ঝামেলামুক্ত অর্ডার করার পদ্ধতি</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {orderSteps.map((step, idx) => (
              <div key={idx} className="relative group">
                <div className="bg-white/5 border border-white/10 p-10 rounded-3xl backdrop-blur-sm h-full flex flex-col items-center text-center transition-all hover:bg-white/10 hover:border-blue-500/50">
                  <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white mb-6 shadow-xl shadow-blue-600/20 group-hover:scale-110 transition-transform">
                    <step.icon size={32} />
                  </div>
                  <div className="absolute top-6 right-6 text-4xl font-black text-white/10">{idx + 1}</div>
                  <h3 className="font-black text-xl mb-4 text-white leading-tight">{step.title}</h3>
                  <p className="text-slate-400 font-medium text-sm leading-relaxed">{step.desc}</p>
                </div>
                {idx < 3 && <div className="hidden lg:block absolute top-1/2 -right-4 translate-y-[-50%] text-white/10"><ArrowRight size={32} /></div>}
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <div className="inline-block bg-slate-800/50 border border-slate-700 px-6 py-3 rounded-2xl text-slate-400 font-bold text-sm italic">
              বিঃদ্রঃ: অনলাইন পেমেন্ট প্রয়োজন নেই – সরাসরি যোগাযোগ করে অর্ডার করুন।
            </div>
          </div>
        </div>
      </section>

      {/* Emotional Trust Section */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="md:w-1/2 relative">
              <div className="relative z-10 rounded-[40px] overflow-hidden shadow-2xl">
                <img src="https://images.unsplash.com/photo-1590644365607-1c5a519a7a37?auto=format&fit=crop&q=80&w=800" alt="Beautiful house" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-50 -z-10 rounded-full"></div>
              <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-slate-100 -z-10 rounded-full"></div>
            </div>
            <div className="md:w-1/2 space-y-8">
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">আপনার বাড়ির সৌন্দর্য, <span className="text-blue-600 italic">আমাদের দায়িত্ব</span></h2>
              <div className="space-y-6 text-lg text-slate-600 font-medium leading-relaxed">
                <p>আমরা বিশ্বাস করি একটি সুন্দর বাড়ি মানে শুধু ডিজাইন নয়, বরং শক্ত কাঠামো ও নির্ভরযোগ্য কাজ। প্রতিটি ইটের গাথুনি যেমন জরুরি, পিলারের সৌন্দর্য ঠিক তেমনি একটি বাড়ির পূর্ণতা আনে।</p>
                <p>Engineers Enterprise আপনার সেই বিশ্বাসের জায়গা। আমরা আপনার স্বপ্নের বাড়িকে এমনভাবে সাজাই যা প্রজন্মের পর প্রজন্ম গর্বের প্রতীক হয়ে থাকবে।</p>
              </div>
              <div className="flex items-center gap-4 p-6 bg-blue-50 rounded-3xl border border-blue-100">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white shrink-0 shadow-lg">
                  <Award size={24} />
                </div>
                <div className="text-sm font-bold text-blue-900 italic">"আমরা শুধু ম্যাটেরিয়াল বিক্রি করি না, আমরা আপনার স্বপ্নের সহযোগী।"</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact & Conversion Strip */}
      <section className="bg-blue-600 py-16 sticky bottom-0 md:relative md:bottom-auto z-40 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-white text-center md:text-left">
            <h2 className="text-3xl font-black mb-2 leading-none">অর্ডার বা বিস্তারিত জানতে এখনই যোগাযোগ করুন</h2>
            <p className="opacity-90 font-medium">আমাদের এক্সপার্ট আপনাকে সঠিক ডিজাইনটি বেছে নিতে সাহায্য করবে</p>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            <a href={`tel:${WHATSAPP_NUMBER}`} className="flex items-center space-x-3 bg-white text-blue-600 px-8 py-4 rounded-2xl font-black shadow-2xl hover:bg-slate-50 transition-all active:scale-95">
              <Phone size={20} />
              <span>কল করুন</span>
            </a>
            <a href={`https://wa.me/${WHATSAPP_NUMBER}`} className="flex items-center space-x-3 bg-green-500 text-white px-8 py-4 rounded-2xl font-black shadow-2xl hover:bg-green-600 transition-all active:scale-95">
              <MessageCircle size={20} />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </section>

      {/* Blog Intro */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-end mb-16 gap-4">
            <div>
              <h2 className="text-4xl font-black text-slate-900 mb-4">জানুন ও বুঝে নিন</h2>
              <p className="text-slate-500 font-medium text-lg">পিলার, ফ্যান্সি ব্লক ও কংক্রিট ডিজাইন সম্পর্কিত টিপস ও গাইড।</p>
            </div>
            <Link to="/blog" className="hidden md:flex items-center gap-2 text-blue-600 font-black hover:gap-3 transition-all">
              সব ব্লগ পড়ুন <ArrowRight size={20} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {[
              {
                title: "কেন ডেকোরেটিভ কংক্রিট পিলার বাড়ির জন্য সেরা?",
                img: "https://images.unsplash.com/photo-1590069230002-70cc83815b21?auto=format&fit=crop&q=80&w=800",
                date: "১৫ মে ২০২৪"
              },
              {
                title: "রডের জং ধরা রোধ করতে কভারিং ব্লকের গুরুত্ব",
                img: "https://images.unsplash.com/photo-1503387762-592dea58ef23?auto=format&fit=crop&q=80&w=800",
                date: "১০ মে ২০২৪"
              }
            ].map((blog, idx) => (
              <Link to="/blog" key={idx} className="group bg-white rounded-[40px] overflow-hidden shadow-sm border border-slate-100 hover:shadow-2xl transition-all">
                <div className="h-60 overflow-hidden">
                  <img src={blog.img} alt={blog.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                </div>
                <div className="p-8">
                  <div className="text-blue-600 text-xs font-black uppercase tracking-widest mb-3">{blog.date}</div>
                  <h3 className="text-2xl font-black text-slate-900 leading-tight group-hover:text-blue-600 transition-colors">{blog.title}</h3>
                  <div className="mt-6 flex items-center gap-2 text-slate-400 font-bold group-hover:text-slate-900 transition-colors">
                    বিস্তারিত পড়ুন <ArrowRight size={18} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
