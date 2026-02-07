
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Package, MessageCircle, Phone } from 'lucide-react';
import { WHATSAPP_NUMBER } from '../constants';

const BottomNav: React.FC = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t z-50 px-6 py-3 flex justify-between items-center shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
      <Link to="/" className={`flex flex-col items-center gap-1 ${isActive('/') ? 'text-blue-600' : 'text-slate-400'}`}>
        <Home size={22} />
        <span className="text-[10px] font-bold">হোম</span>
      </Link>
      <Link to="/products" className={`flex flex-col items-center gap-1 ${isActive('/products') ? 'text-blue-600' : 'text-slate-400'}`}>
        <Package size={22} />
        <span className="text-[10px] font-bold">প্রোডাক্টস</span>
      </Link>
      <a href={`https://wa.me/${WHATSAPP_NUMBER}`} className="flex flex-col items-center gap-1 text-green-500">
        <MessageCircle size={22} />
        <span className="text-[10px] font-bold">WhatsApp</span>
      </a>
      <a href={`tel:${WHATSAPP_NUMBER}`} className="flex flex-col items-center gap-1 text-blue-500">
        <Phone size={22} />
        <span className="text-[10px] font-bold">কল দিন</span>
      </a>
    </div>
  );
};

export default BottomNav;
