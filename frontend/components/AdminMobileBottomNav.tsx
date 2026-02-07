
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, Users, Package, MessageSquare } from 'lucide-react';

const AdminMobileBottomNav: React.FC = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { name: 'হোম', path: '/admin', icon: LayoutDashboard },
    { name: 'অর্ডার', path: '/admin/orders', icon: ShoppingBag },
    { name: 'গ্রাহক', path: '/admin/customers', icon: Users },
    { name: 'পণ্য', path: '/admin/products', icon: Package },
    { name: 'মেসেজ', path: '/admin/whatsapp', icon: MessageSquare },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t z-[100] px-2 py-2 flex justify-around items-center shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`flex flex-col items-center gap-1 min-w-[64px] py-1 rounded-xl transition-all ${
            isActive(item.path) ? 'text-blue-600 bg-blue-50' : 'text-slate-400'
          }`}
        >
          <item.icon size={20} strokeWidth={isActive(item.path) ? 2.5 : 2} />
          <span className="text-[10px] font-bold">{item.name}</span>
        </Link>
      ))}
    </div>
  );
};

export default AdminMobileBottomNav;
