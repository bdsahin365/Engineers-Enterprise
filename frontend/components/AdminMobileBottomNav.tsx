
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, Users, Package } from 'lucide-react';

const AdminMobileBottomNav: React.FC = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { name: 'হোম', path: '/admin', icon: LayoutDashboard },
    { name: 'অর্ডার', path: '/admin/orders', icon: ShoppingBag },
    { name: 'গ্রাহক', path: '/admin/customers', icon: Users },
    { name: 'পণ্য', path: '/admin/products', icon: Package },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-slate-200 z-[100] px-2 py-2 flex justify-around items-center shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`flex flex-col items-center gap-1 min-w-[70px] py-2 px-3 rounded-2xl transition-all ${isActive(item.path)
              ? 'text-white bg-gradient-to-br from-indigo-500 to-blue-600 shadow-lg shadow-indigo-500/30 scale-105'
              : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
            }`}
        >
          <item.icon size={22} strokeWidth={isActive(item.path) ? 2.5 : 2} />
          <span className="text-[10px] font-bold">{item.name}</span>
        </Link>
      ))}
    </div>
  );
};

export default AdminMobileBottomNav;
