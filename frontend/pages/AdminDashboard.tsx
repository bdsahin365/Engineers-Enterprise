
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShoppingBag, Users, Package, 
  ChevronRight, Plus, Printer, 
  FileText, Hammer
} from 'lucide-react';
import { Order, Customer, Product, UserRole } from '../types';
import AdminLayout from '../components/AdminLayout';

interface Props {
  orders: Order[];
  customers: Customer[];
  products: Product[];
  user: { name: string, role: UserRole };
}

const AdminDashboard: React.FC<Props> = ({ orders, customers, products, user }) => {
  const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);

  const stats = [
    { name: "আজকের অর্ডার", value: orders.filter(o => o.createdAt === new Date().toISOString().split('T')[0]).length, icon: ShoppingBag, color: "text-blue-600", bg: "bg-blue-50" },
    { name: "পেন্ডিং অর্ডার", value: orders.filter(o => o.status !== 'ডেলিভারড').length, icon: FileText, color: "text-orange-600", bg: "bg-orange-50" },
    { name: "মোট গ্রাহক", value: customers.length, icon: Users, color: "text-purple-600", bg: "bg-purple-50" }
  ];

  return (
    <AdminLayout user={user} title="ড্যাশবোর্ড">
      <div className="space-y-6 md:space-y-8">
        {/* Welcome Card */}
        <div className="bg-white p-5 md:p-8 rounded-[24px] md:rounded-[40px] border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden group">
          <div className="absolute -right-6 -bottom-6 opacity-[0.03] group-hover:scale-110 transition-transform duration-700">
             {/* Added Hammer icon to the background */}
             <Hammer size={150} />
          </div>
          <div className="relative z-10">
            <h3 className="text-xl md:text-2xl font-black text-slate-900 mb-1">👋 স্বাগতম, {user.name}</h3>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-wider">{new Date().toLocaleDateString('bn-BD', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          <div className="w-full md:w-auto p-4 md:p-6 bg-slate-900 rounded-[24px] text-white relative z-10 shadow-xl shadow-slate-200">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">মোট বিক্রি (মোটাল)</p>
            <p className="text-2xl md:text-3xl font-black text-blue-400">৳{totalRevenue.toLocaleString()}</p>
          </div>
        </div>

        {/* Quick Actions - 2x2 on Mobile */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          <Link to="/admin/orders" className="bg-blue-600 text-white p-4 md:p-8 rounded-[24px] md:rounded-[32px] shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95 flex flex-col items-center justify-center gap-2 text-center group">
            <div className="bg-white/20 p-3 rounded-2xl group-hover:scale-110 transition-transform"><Plus size={24} /></div>
            <span className="font-black text-xs md:text-lg uppercase tracking-tight">নতুন অর্ডার</span>
          </Link>
          <Link to="/admin/customers" className="bg-white text-slate-900 p-4 md:p-8 rounded-[24px] md:rounded-[32px] border border-slate-100 shadow-sm hover:border-blue-600 transition-all active:scale-95 flex flex-col items-center justify-center gap-2 text-center group">
            <div className="bg-blue-50 p-3 rounded-2xl text-blue-600 group-hover:scale-110 transition-transform"><Users size={24} /></div>
            <span className="font-black text-xs md:text-lg uppercase tracking-tight">নতুন গ্রাহক</span>
          </Link>
          <Link to="/admin/products" className="bg-white text-slate-900 p-4 md:p-8 rounded-[24px] md:rounded-[32px] border border-slate-100 shadow-sm hover:border-blue-600 transition-all active:scale-95 flex flex-col items-center justify-center gap-2 text-center group">
            <div className="bg-blue-50 p-3 rounded-2xl text-blue-600 group-hover:scale-110 transition-transform"><Package size={24} /></div>
            <span className="font-black text-xs md:text-lg uppercase tracking-tight">নতুন পণ্য</span>
          </Link>
          <Link to="/admin/orders" className="bg-white text-slate-900 p-4 md:p-8 rounded-[24px] md:rounded-[32px] border border-slate-100 shadow-sm hover:border-blue-600 transition-all active:scale-95 flex flex-col items-center justify-center gap-2 text-center group">
            <div className="bg-blue-50 p-3 rounded-2xl text-blue-600 group-hover:scale-110 transition-transform"><Printer size={24} /></div>
            <span className="font-black text-xs md:text-lg uppercase tracking-tight">ইনভয়েস</span>
          </Link>
        </div>

        {/* Summary Stats - 1 col on Mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white p-5 md:p-8 rounded-[24px] md:rounded-[40px] border border-slate-100 shadow-sm flex items-center gap-4">
              <div className={`${stat.bg} ${stat.color} p-4 md:p-6 rounded-[20px] md:rounded-[28px]`}>
                <stat.icon size={28} />
              </div>
              <div>
                <p className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{stat.name}</p>
                <p className="text-xl md:text-3xl font-black text-slate-900">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Orders Table - Mobile Cards, Desktop Table */}
        <div className="bg-white rounded-[24px] md:rounded-[40px] border border-slate-100 shadow-sm overflow-hidden mb-12">
          <div className="p-6 md:p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
            <h4 className="font-black text-slate-900 uppercase tracking-tight">সাম্প্রতিক অর্ডারসমূহ</h4>
            <Link to="/admin/orders" className="text-blue-600 text-xs font-black uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all">সবগুলো <ChevronRight size={14} /></Link>
          </div>
          
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b">
                <tr>
                  <th className="px-8 py-5">ID</th>
                  <th className="px-8 py-5">গ্রাহক</th>
                  <th className="px-8 py-5">স্ট্যাটাস</th>
                  <th className="px-8 py-5 text-right">মোট টাকা</th>
                  <th className="px-8 py-5 text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {orders.slice(0, 5).map(order => (
                  <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-6 font-mono font-bold text-blue-600">{order.orderNo}</td>
                    <td className="px-8 py-6">
                      <p className="font-black text-slate-900">{customers.find(c => c.id === order.customerId)?.name || 'অজানা'}</p>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                        order.status === 'ডেলিভারড' ? 'bg-green-100 text-green-700' : 
                        order.status === 'কনফার্মড' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right font-black text-slate-900">৳{order.totalPrice.toLocaleString()}</td>
                    <td className="px-8 py-6 text-right">
                      <Link to={`/admin/invoices/${order.id}`} className="bg-blue-50 text-blue-600 p-3 rounded-2xl inline-block hover:bg-blue-600 hover:text-white transition-all">
                        <ChevronRight size={20} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List */}
          <div className="md:hidden divide-y divide-slate-50">
            {orders.slice(0, 5).map(order => (
              <Link key={order.id} to={`/admin/invoices/${order.id}`} className="block p-5 active:bg-slate-50 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <span className="font-mono font-black text-blue-600 text-xs tracking-tighter bg-blue-50 px-2 py-0.5 rounded">{order.orderNo}</span>
                  <span className={`px-3 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${
                    order.status === 'ডেলিভারড' ? 'bg-green-100 text-green-700' : 
                    order.status === 'কনফার্মড' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {order.status}
                  </span>
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="font-black text-slate-900 text-sm">{customers.find(c => c.id === order.customerId)?.name || 'অজানা'}</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{order.createdAt}</p>
                  </div>
                  <p className="font-black text-slate-900">৳{order.totalPrice.toLocaleString()}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
