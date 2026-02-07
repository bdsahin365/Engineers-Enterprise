
import React from 'react';
import { Link } from 'react-router-dom';
import { Hammer, Facebook, MessageSquare, Phone } from 'lucide-react';

import { api } from '../api';
import { GlobalData } from '../types';

const Footer: React.FC = () => {
  const [globalData, setGlobalData] = React.useState<GlobalData | null>(null);

  React.useEffect(() => {
    const fetchGlobal = async () => {
      try {
        const data = await api.getGlobal();
        setGlobalData(data);
      } catch (error) {
        console.error("Failed to fetch global data:", error);
      }
    };
    fetchGlobal();
  }, []);

  // Hardcoded logo URL as constant - ALWAYS use this as fallback
  const LOGO_URL = "https://dynamic-novelty-0723b13493.media.strapiapp.com/logo_a6d7338933.png";

  const siteName = globalData?.siteName || "Engineers Enterprise";
  const address = globalData?.address;
  const phone = globalData?.contactPhone || "+৮৮০ ১৭XXXXXXXXX";
  const email = globalData?.contactEmail;
  const fbLink = globalData?.facebookLink || "#";
  const ytLink = globalData?.youtubeLink || "#";
  // Ensure logo always has a value - use CMS logo only if it exists and is a valid string
  const logoUrl = (globalData?.logo && typeof globalData.logo === 'string' && globalData.logo.trim() !== '') ? globalData.logo : LOGO_URL;

  return (
    <footer className="bg-slate-900 text-white pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <img
                src={logoUrl}
                alt={globalData?.siteName || "Engineers Enterprise"}
                className="h-10 object-contain brightness-0 invert"
              />
            </Link>
            <p className="text-sm leading-relaxed">
              {siteName} বাংলাদেশের নির্মাণ শিল্পের জন্য একটি বিশ্বস্ত নাম। আমরা উচ্চমানের ডেকোরেটিভ কংক্রিট ডিজাইন সরবরাহ করি।
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 text-lg">গুরুত্বপূর্ণ লিঙ্ক</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/products" className="hover:text-blue-400 transition-colors">সব প্রোডাক্টস</Link></li>
              <li><Link to="/blog" className="hover:text-blue-400 transition-colors">নির্মাণ টিপস</Link></li>
              <li><Link to="/about" className="hover:text-blue-400 transition-colors">আমাদের সম্পর্কে</Link></li>
              <li><Link to="/contact" className="hover:text-blue-400 transition-colors">যোগাযোগ</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 text-lg">প্রোডাক্ট ক্যাটাগরি</h4>
            <ul className="space-y-3 text-sm">
              <li>পোরচ পিলার ডিজাইন</li>
              <li>ক্লিয়ার কভারিং ব্লক</li>
              <li>ফ্যান্সি ব্লক ডিজাইন</li>
              <li>ব্যালকনি পিলার ডিজাইন</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 text-lg">যোগাযোগ</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start space-x-3">
                <Phone size={18} className="text-blue-500 shrink-0" />
                <span>{phone}</span>
              </li>
              {email && (
                <li className="flex items-start space-x-3">
                  <MessageSquare size={18} className="text-green-500 shrink-0" />
                  <span>Email: {email}</span>
                </li>
              )}
              {address && (
                <li className="flex items-start space-x-3">
                  <span className="text-xs text-slate-400">{address}</span>
                </li>
              )}
              <li className="flex space-x-4 pt-2">
                <a href={fbLink} className="p-2 bg-slate-800 rounded-full hover:bg-blue-600 transition-colors">
                  <Facebook size={20} />
                </a>
                <a href={ytLink} className="p-2 bg-slate-800 rounded-full hover:bg-green-600 transition-colors">
                  <MessageSquare size={20} />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-16 pt-8 text-center text-xs">
          <div className="border-t border-slate-800 mt-16 pt-8 text-center text-xs">
            <p>© {new Date().getFullYear()} {siteName}। সর্বস্বত্ব সংরক্ষিত।</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
