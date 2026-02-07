
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, ShoppingBag, Users, Package,
  MessageSquare, Menu, X, LogOut,
  FileText, Hammer, Settings, ChevronLeft, Wifi, WifiOff, Globe, Home, Database
} from 'lucide-react';
import { UserRole } from '../types';
import AdminMobileBottomNav from './AdminMobileBottomNav';
import { api } from '../api';

interface Props {
  children: React.ReactNode;
  user: { name: string, role: UserRole };
  title: string;
  showBackButton?: boolean;
}

const AdminLayout: React.FC<Props> = ({ children, user, title, showBackButton }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string>('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const checkStatus = async () => {
      const connected = await api.checkConnection();
      setIsConnected(connected);
    };
    checkStatus();
    // Poll every 30 seconds
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchGlobalData = async () => {
      try {
        const globalData = await api.getGlobal();
        if (globalData.logo) {
          setLogoUrl(globalData.logo);
        }
      } catch (error) {
        console.error('Failed to fetch global data:', error);
      }
    };
    fetchGlobalData();
  }, []);

  const menuItems = [
    { name: 'ড্যাশবোর্ড', path: '/admin', icon: LayoutDashboard },
    { name: 'অর্ডারসমূহ', path: '/admin/orders', icon: ShoppingBag },
    { name: 'গ্রাহক', path: '/admin/customers', icon: Users },
    { name: 'পণ্যসমূহ', path: '/admin/products', icon: Package },
  ];

  const SidebarContent = ({ isCollapsed = false }: { isCollapsed?: boolean }) => (
    <div className="flex flex-col h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className={`p-6 border-b border-slate-700/50 ${isCollapsed ? 'px-3' : ''}`}>
        <Link to="/" className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
          {logoUrl ? (
            <img
              src={logoUrl}
              alt="Logo"
              className={`${isCollapsed ? 'w-10 h-10' : 'h-10'} object-contain`}
            />
          ) : (
            <>
              <div className="bg-gradient-to-br from-indigo-500 to-blue-600 p-2 rounded-xl text-white shadow-lg shadow-indigo-500/30">
                <Hammer size={24} />
              </div>
              {!isCollapsed && (
                <div>
                  <h1 className="font-black text-white leading-none">ENGINEERS</h1>
                  <p className="text-[10px] font-bold text-indigo-400 tracking-widest uppercase">Admin Panel</p>
                </div>
              )}
            </>
          )}
        </Link>
      </div>

      <nav className="flex-grow p-4 space-y-1 overflow-y-auto custom-scrollbar">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            onClick={() => setSidebarOpen(false)}
            className={`group flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold transition-all relative ${location.pathname === item.path
              ? 'bg-gradient-to-r from-indigo-500 to-blue-600 text-white shadow-lg shadow-indigo-500/30'
              : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
              } ${isCollapsed ? 'justify-center' : ''}`}
          >
            <item.icon size={20} />
            {!isCollapsed && <span>{item.name}</span>}
            {isCollapsed && (
              <div className="absolute left-full ml-2 px-3 py-2 bg-slate-800 text-white text-sm font-bold rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap shadow-xl z-50">
                {item.name}
              </div>
            )}
          </Link>
        ))}
        {user.role === UserRole.ADMIN && (
          <Link
            to="/admin/settings"
            className={`group flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-slate-300 hover:bg-slate-700/50 hover:text-white transition-all relative ${isCollapsed ? 'justify-center' : ''}`}
          >
            <Settings size={20} />
            {!isCollapsed && <span>সেটিংস</span>}
            {isCollapsed && (
              <div className="absolute left-full ml-2 px-3 py-2 bg-slate-800 text-white text-sm font-bold rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap shadow-xl z-50">
                সেটিংস
              </div>
            )}
          </Link>
        )}
      </nav>

      <div className={`p-4 border-t border-slate-700/50 pb-24 md:pb-4 ${isCollapsed ? 'px-2' : ''}`}>
        <div className={`flex items-center gap-3 p-3 bg-slate-700/30 rounded-xl backdrop-blur-sm ${isCollapsed ? 'justify-center' : ''}`}>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-blue-500 flex items-center justify-center text-white font-bold border-2 border-slate-600 shadow-sm overflow-hidden flex-shrink-0">
            {user.name[0]}
          </div>
          {!isCollapsed && (
            <>
              <div className="flex-grow overflow-hidden">
                <p className="text-sm font-bold text-white leading-none truncate">{user.name}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">{user.role}</p>
              </div>
              <button className="text-slate-400 hover:text-red-400 p-1 transition-colors">
                <LogOut size={18} />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row admin-theme">
      {/* Mobile Drawer */}
      <div className={`fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110] md:hidden transition-all duration-300 ${isSidebarOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`} onClick={() => setSidebarOpen(false)}>
        <div className={`w-72 h-full shadow-2xl transition-transform duration-300 ease-out transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`} onClick={e => e.stopPropagation()}>
          <SidebarContent />
        </div>
      </div>

      {/* Desktop Sidebar */}
      <aside className={`hidden md:block ${isSidebarCollapsed ? 'w-20' : 'w-72'} bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-r border-slate-700/50 h-screen sticky top-0 transition-all duration-300`}>
        <SidebarContent isCollapsed={isSidebarCollapsed} />
        {/* Collapse Toggle Button */}
        <button
          onClick={() => setSidebarCollapsed(!isSidebarCollapsed)}
          className="absolute -right-3 top-20 bg-gradient-to-br from-indigo-500 to-blue-600 text-white p-1.5 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 border-2 border-slate-900"
        >
          {isSidebarCollapsed ? (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          )}
        </button>
      </aside>

      {/* Main Content */}
      <div className="flex-grow flex flex-col min-w-0">
        {/* Responsive Header */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b px-4 md:px-8 h-16 md:h-20 flex items-center justify-between no-print">
          <div className="flex items-center gap-2 md:gap-3">
            {showBackButton ? (
              <button onClick={() => navigate(-1)} className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
                <ChevronLeft size={24} />
              </button>
            ) : (
              <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
                <Menu size={24} />
              </button>
            )}
            <h2 className="text-base md:text-xl font-black text-slate-900 truncate max-w-[200px] md:max-w-none">{title}</h2>
          </div>

          <div className="flex items-center gap-3">
            {/* Connection Status Badge */}
            <div className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${isConnected
              ? 'bg-green-50 text-green-600 border-green-100'
              : 'bg-orange-50 text-orange-600 border-orange-100'
              }`}>
              {isConnected ? <Wifi size={14} /> : <WifiOff size={14} />}
              {isConnected ? 'Server Connected' : 'Mock Data'}
            </div>

            <div className="hidden sm:block text-right">
              <p className="text-xs font-black text-blue-600 uppercase tracking-widest">{user.role}</p>
            </div>
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold border-2 border-white shadow-sm overflow-hidden">
                <img src={`https://ui-avatars.com/api/?name=${user.name}&background=DBEAFE&color=2563EB&bold=true`} alt={user.name} />
              </div>
            </div>
          </div>
        </header>

        {/* Page Body */}
        <main className="flex-grow p-4 md:p-8 pb-32 md:pb-8">
          {/* Mobile Connection Alert */}
          <div className={`sm:hidden mb-4 p-3 rounded-xl flex items-center justify-center gap-2 text-xs font-black uppercase tracking-wide ${isConnected
            ? 'bg-green-50 text-green-600'
            : 'bg-orange-50 text-orange-600'
            }`}>
            {isConnected ? <Wifi size={14} /> : <WifiOff size={14} />}
            {isConnected ? 'Server Connected' : 'Using Mock Data'}
          </div>
          {children}
        </main>

        <AdminMobileBottomNav />
      </div>
    </div>
  );
};

export default AdminLayout;
