
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Hammer, PhoneCall, MessageSquare } from 'lucide-react';
import { WHATSAPP_NUMBER } from '../constants';

import { api } from '../api';
import { GlobalData } from '../types';

const Navbar: React.FC = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
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

  const whatsapp = globalData?.contactPhone || WHATSAPP_NUMBER;
  const displayTitle = globalData?.siteName || "Engineers Enterprise";


  return (
    <nav className="bg-white border-b sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 md:h-20">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="bg-blue-600 p-1.5 md:p-2 rounded-lg group-hover:bg-blue-700 transition-colors shadow-blue-100 shadow-lg">
                <Hammer className="text-white w-5 h-5 md:w-6 md:h-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg md:text-xl font-black text-slate-900 tracking-tight leading-none uppercase">{displayTitle.split(' ')[0]}</span>
                <span className="text-[10px] md:text-xs font-bold text-blue-600 uppercase tracking-widest">{displayTitle.split(' ').slice(1).join(' ')}</span>
              </div>
            </Link>
          </div>

          {/* Desktop Links - Hidden on Mobile */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="flex space-x-6">
              {[
                { name: 'হোম', path: '/' },
                { name: 'প্রোডাক্টস', path: '/products' },
                { name: 'ব্লগ', path: '/blog' },
                { name: 'যোগাযোগ', path: '/contact' },
              ].map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-bold transition-all hover:scale-105 ${isActive(link.path) ? 'text-blue-600 border-b-2 border-blue-600 pb-1' : 'text-slate-600 hover:text-blue-600'
                    }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="h-6 w-px bg-slate-200"></div>

            <div className="flex items-center gap-3">
              <a
                href={`https://wa.me/${whatsapp}`}
                className="flex items-center space-x-2 text-green-600 font-bold text-sm hover:text-green-700 transition-colors"
              >
                <MessageSquare size={18} />
                <span>WhatsApp</span>
              </a>
              <a
                href={`tel:${whatsapp}`}
                className="flex items-center space-x-2 bg-blue-600 text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-blue-700 transition-all shadow-md hover:shadow-lg active:scale-95"
              >
                <PhoneCall size={16} />
                <span>কল করুন</span>
              </a>
            </div>
          </div>

          {/* Mobile Right Icons (Minimal) */}
          <div className="md:hidden flex items-center space-x-4">
            <a href={`tel:${whatsapp}`} className="p-2 text-blue-600 bg-blue-50 rounded-full">
              <PhoneCall size={20} />
            </a>
            <Link to="/admin" className="text-[10px] font-black uppercase text-slate-400">Admin</Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
