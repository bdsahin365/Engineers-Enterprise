
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus, Search, Printer, Menu, X, Check,
  ChevronRight, ArrowLeft, User as UserIcon, Package,
  Trash2, DollarSign, MapPin, Calendar, CheckCircle2, Info
} from 'lucide-react';
import { Order, Product, Customer, OrderStatus, OrderItem, UserRole } from '../types';
import AdminLayout from '../components/AdminLayout';

interface Props {
  orders: Order[];
  products: Product[];
  customers: Customer[];
  onAddOrder: (order: Order) => void;
  user: { name: string, role: UserRole };
}

const AdminOrders: React.FC<Props> = ({ orders, products, customers, onAddOrder, user }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  // Order Form State
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [status, setStatus] = useState<OrderStatus>(OrderStatus.DRAFT);

  const filteredOrders = orders.filter(o => {
    const cust = customers.find(c => c.id === o.customerId);
    return o.orderNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cust?.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const addItem = (product: Product) => {
    const newItem: OrderItem = {
      productId: product.id,
      quantity: 1,
      pillarFeet: product.isPillar ? 10 : undefined,
      selectedTopId: product.pillarConfig?.tops[0]?.id,
      selectedBottomId: product.pillarConfig?.bottoms[0]?.id,
      calculatedPrice: 0
    };
    newItem.calculatedPrice = calculateItemPrice(newItem, product);
    setOrderItems([...orderItems, newItem]);
  };

  const calculateItemPrice = (item: OrderItem, product: Product) => {
    if (!product.isPillar) return (product.price || 0) * item.quantity;
    const config = product.pillarConfig!;
    let price = 0;
    const top = config.tops.find(t => t.id === item.selectedTopId);
    const bottom = config.bottoms.find(b => b.id === item.selectedBottomId);

    if (top) price += top.price;
    if (bottom) price += bottom.price;
    price += (item.pillarFeet || 0) * config.middlePricePerFoot;

    return price * item.quantity;
  };

  const updateItem = (index: number, updates: Partial<OrderItem>) => {
    const newItems = [...orderItems];
    const product = products.find(p => p.id === newItems[index].productId)!;
    newItems[index] = { ...newItems[index], ...updates };
    newItems[index].calculatedPrice = calculateItemPrice(newItems[index], product);
    setOrderItems(newItems);
  };

  const removeItem = (index: number) => {
    setOrderItems(orderItems.filter((_, i) => i !== index));
  };

  const totalPrice = orderItems.reduce((sum, item) => sum + item.calculatedPrice, 0);

  const handleSubmit = () => {
    if (!selectedCustomerId || orderItems.length === 0) return;
    const newOrder: Order = {
      id: 'o' + Date.now(),
      orderNo: 'ORD-' + (orders.length + 1001),
      customerId: selectedCustomerId,
      items: orderItems,
      totalPrice,
      status,
      deliveryDate,
      deliveryAddress,
      createdAt: new Date().toISOString().split('T')[0],
      createdBy: user.name
    };
    onAddOrder(newOrder);
    setIsModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setCurrentStep(1);
    setSelectedCustomerId('');
    setOrderItems([]);
    setDeliveryAddress('');
    setDeliveryDate('');
    setStatus(OrderStatus.DRAFT);
  };

  return (
    <AdminLayout user={user} title="অর্ডারসমূহ">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
          <div className="relative flex-grow max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="অর্ডার বা গ্রাহক খুঁজুন..."
              className="w-full pl-10 pr-4 py-4 bg-white rounded-2xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black shadow-lg shadow-blue-100 flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            <Plus size={20} /> নতুন অর্ডার
          </button>
        </div>

        <div className="bg-white rounded-[32px] md:rounded-[40px] border border-slate-100 shadow-sm overflow-hidden mb-12">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 tracking-widest border-b border-slate-50">
                <tr>
                  <th className="px-8 py-5">ID</th>
                  <th className="px-8 py-5">গ্রাহক</th>
                  <th className="px-8 py-5">মূল্য</th>
                  <th className="px-8 py-5">তারিখ</th>
                  <th className="px-8 py-5">স্ট্যাটাস</th>
                  <th className="px-8 py-5 text-right">ইনভয়েস</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredOrders.map(o => (
                  <tr key={o.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-6 font-mono font-bold text-blue-600 uppercase tracking-tighter">{o.orderNo}</td>
                    <td className="px-8 py-6 font-black text-slate-900">{customers.find(c => c.id === o.customerId)?.name}</td>
                    <td className="px-8 py-6 font-black text-slate-900">৳{o.totalPrice.toLocaleString()}</td>
                    <td className="px-8 py-6 text-xs text-slate-400 font-bold uppercase tracking-widest">{o.createdAt}</td>
                    <td className="px-8 py-6">
                      <span className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${o.status === 'ডেলিভারড' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>{o.status}</span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <Link to={`/admin/invoices/${o.id}`} className="bg-blue-50 text-blue-600 p-3 hover:bg-blue-600 hover:text-white rounded-2xl inline-block transition-all"><Printer size={20} /></Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List */}
          <div className="md:hidden divide-y divide-slate-50">
            {filteredOrders.map(o => (
              <div key={o.id} className="p-5 bg-white active:bg-slate-50 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex flex-col">
                    <span className="font-mono font-black text-blue-600 text-[10px] bg-blue-50 px-2 py-0.5 rounded tracking-tighter w-fit uppercase">{o.orderNo}</span>
                    <p className="font-black text-slate-900 mt-2 text-base leading-none">{customers.find(c => c.id === o.customerId)?.name}</p>
                  </div>
                  <div className="flex flex-col items-end gap-3">
                    <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${o.status === 'ডেলিভারড' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>{o.status}</span>
                    <Link to={`/admin/invoices/${o.id}`} className="text-blue-600 p-2 bg-blue-50 rounded-xl"><Printer size={18} /></Link>
                  </div>
                </div>
                <div className="flex justify-between items-center mt-3 border-t pt-3 border-slate-50">
                  <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest">{o.createdAt}</span>
                  <span className="font-black text-slate-900 text-lg">৳{o.totalPrice.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-end md:items-center justify-center p-0 md:p-4 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="bg-white w-full h-[95vh] md:h-auto md:rounded-[48px] md:max-w-4xl md:max-h-[90vh] overflow-hidden relative shadow-2xl flex flex-col rounded-t-[32px] animate-in slide-in-from-bottom duration-500">
            {/* Modal Header */}
            <div className="px-6 md:px-12 py-6 md:py-10 border-b flex justify-between items-center bg-white z-10">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black">
                  {currentStep}
                </div>
                <div>
                  <h2 className="text-xl md:text-3xl font-black text-slate-900 tracking-tight">নতুন অর্ডার</h2>
                  <p className="text-slate-400 text-[10px] md:text-xs font-black uppercase tracking-widest">ধাপ {currentStep} / ৪: {currentStep === 1 ? 'গ্রাহক' : currentStep === 2 ? 'পণ্য' : currentStep === 3 ? 'মূল্য' : 'ডেলিভারি'}</p>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-3 bg-slate-100 hover:bg-red-50 hover:text-red-500 rounded-2xl transition-all"><X size={24} /></button>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-100 h-1.5 flex">
              <div className={`h-full bg-blue-600 transition-all duration-700 ease-out ${currentStep === 1 ? 'w-1/4' : currentStep === 2 ? 'w-1/2' : currentStep === 3 ? 'w-3/4' : 'w-full'}`}></div>
            </div>

            {/* Content Area */}
            <div className="flex-grow overflow-y-auto p-6 md:p-12 custom-scrollbar">
              {currentStep === 1 && (
                <div className="space-y-6 animate-in slide-in-from-right duration-500">
                  <h3 className="text-lg md:text-xl font-black flex items-center gap-3 text-slate-900">
                    <div className="p-2 bg-blue-50 rounded-xl text-blue-600"><UserIcon size={20} /></div>
                    গ্রাহক নির্বাচন করুন
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {customers.map(c => (
                      <button key={c.id} onClick={() => setSelectedCustomerId(c.id)} className={`group p-6 rounded-[32px] border-2 text-left transition-all flex items-center gap-4 ${selectedCustomerId === c.id ? 'border-blue-600 bg-blue-50/50 shadow-xl scale-[1.02]' : 'border-slate-50 bg-slate-50 hover:bg-white hover:border-blue-200 shadow-sm'}`}>
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg transition-colors ${selectedCustomerId === c.id ? 'bg-blue-600 text-white' : 'bg-white text-slate-400 group-hover:text-blue-600'}`}>
                          {c.name[0]}
                        </div>
                        <div>
                          <p className="font-black text-slate-900 text-base md:text-lg">{c.name}</p>
                          <p className="text-[10px] md:text-xs text-slate-400 font-black uppercase tracking-widest">{c.phone}</p>
                        </div>
                        {selectedCustomerId === c.id && <div className="ml-auto text-blue-600"><CheckCircle2 size={24} fill="currentColor" className="text-white" /></div>}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-8 animate-in slide-in-from-right duration-500">
                  <h3 className="text-lg md:text-xl font-black flex items-center gap-3 text-slate-900">
                    <div className="p-2 bg-blue-50 rounded-xl text-blue-600"><Package size={20} /></div>
                    পণ্য যোগ করুন
                  </h3>

                  <div className="flex flex-wrap gap-2 md:gap-4 mb-4">
                    {products.map(p => (
                      <button key={p.id} onClick={() => addItem(p)} className="px-5 py-3 bg-white border border-slate-100 hover:bg-blue-600 hover:text-white rounded-2xl font-black text-xs md:text-sm transition-all shadow-sm active:scale-95 flex items-center gap-2">
                        <Plus size={16} /> {p.name}
                      </button>
                    ))}
                  </div>

                  <div className="space-y-6">
                    {orderItems.map((item, idx) => {
                      const product = products.find(p => p.id === item.productId)!;
                      return (
                        <div key={idx} className="bg-slate-50 p-6 md:p-10 rounded-[40px] border border-slate-100 space-y-6 relative group/item overflow-hidden">
                          <div className="absolute top-0 right-0 p-4">
                            <button onClick={() => removeItem(idx)} className="p-3 bg-white text-red-500 hover:bg-red-500 hover:text-white rounded-2xl shadow-sm transition-all"><Trash2 size={20} /></button>
                          </div>

                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-3xl overflow-hidden border border-white shadow-md">
                              <img src={product.images[0]} className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <p className="font-black text-slate-900 text-lg md:text-xl leading-none mb-1">{product.name}</p>
                              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{product.modelNo}</p>
                            </div>
                          </div>

                          {product.isPillar ? (
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-white">
                              <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-2">টপ ডিজাইন</label>
                                <select className="w-full p-4 bg-white rounded-2xl text-xs font-black outline-none border-none shadow-sm appearance-none" value={item.selectedTopId} onChange={e => updateItem(idx, { selectedTopId: e.target.value })}>
                                  <option value="">টপ ছাড়া</option>
                                  {product.pillarConfig?.tops.map(t => <option key={t.id} value={t.id}>{t.name} (৳{t.price})</option>)}
                                </select>
                              </div>
                              <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-2">বেস ডিজাইন</label>
                                <select className="w-full p-4 bg-white rounded-2xl text-xs font-black outline-none border-none shadow-sm appearance-none" value={item.selectedBottomId} onChange={e => updateItem(idx, { selectedBottomId: e.target.value })}>
                                  <option value="">বেস ছাড়া</option>
                                  {product.pillarConfig?.bottoms.map(b => <option key={b.id} value={b.id}>{b.name} (৳{b.price})</option>)}
                                </select>
                              </div>
                              <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-2">বডি রানিং ফুট</label>
                                <div className="relative">
                                  <input type="number" className="w-full p-4 bg-white rounded-2xl text-xs font-black outline-none border-none shadow-sm" value={item.pillarFeet} onChange={e => updateItem(idx, { pillarFeet: parseInt(e.target.value) })} />
                                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-300">FT</span>
                                </div>
                              </div>
                            </div>
                          ) : null}

                          <div className="flex flex-col sm:flex-row justify-between items-center gap-6 pt-6 border-t border-white">
                            <div className="flex items-center gap-4 w-full sm:w-auto">
                              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest shrink-0">পরিমাণ</label>
                              <div className="flex items-center bg-white rounded-2xl shadow-sm overflow-hidden p-1">
                                <button type="button" onClick={() => updateItem(idx, { quantity: Math.max(1, item.quantity - 1) })} className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-blue-600 transition-colors">-</button>
                                <input type="number" className="w-12 text-center text-sm font-black outline-none border-none bg-transparent" value={item.quantity} onChange={e => updateItem(idx, { quantity: parseInt(e.target.value) || 1 })} />
                                <button type="button" onClick={() => updateItem(idx, { quantity: item.quantity + 1 })} className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-blue-600 transition-colors">+</button>
                              </div>
                            </div>
                            <div className="text-right w-full sm:w-auto bg-white p-4 rounded-3xl shadow-sm px-8">
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">মোট মূল্য</p>
                              <p className="text-2xl font-black text-slate-900 leading-none">৳{item.calculatedPrice.toLocaleString()}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    {orderItems.length === 0 && (
                      <div className="flex flex-col items-center justify-center py-20 bg-slate-50 border-2 border-dashed border-slate-100 rounded-[40px] text-slate-300">
                        <Package size={64} strokeWidth={1} className="mb-4 opacity-20" />
                        <p className="font-black text-sm uppercase tracking-[0.3em]">কোন পণ্য যোগ করা হয়নি</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-10 animate-in slide-in-from-right duration-500">
                  <h3 className="text-lg md:text-xl font-black flex items-center gap-3 text-slate-900">
                    <div className="p-2 bg-blue-50 rounded-xl text-blue-600"><DollarSign size={20} /></div>
                    অর্ডার সামারি (Summary)
                  </h3>
                  <div className="bg-slate-900 text-white p-8 md:p-16 rounded-[48px] shadow-2xl relative overflow-hidden group">
                    <div className="absolute -right-20 -bottom-20 opacity-[0.05] group-hover:scale-110 transition-transform duration-1000">
                      <DollarSign size={300} />
                    </div>
                    <div className="relative z-10">
                      <div className="space-y-6 mb-10 max-h-80 overflow-y-auto pr-4 custom-scrollbar">
                        {orderItems.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-start border-b border-white/10 pb-6 last:border-0">
                            <div>
                              <p className="font-black text-lg md:text-xl text-white leading-none mb-1">{products.find(p => p.id === item.productId)?.name}</p>
                              <p className="text-[10px] md:text-xs text-blue-400 font-black uppercase tracking-widest">{item.quantity} পিস আইটেম</p>
                            </div>
                            <p className="font-black text-lg md:text-xl text-white">৳{item.calculatedPrice.toLocaleString()}</p>
                          </div>
                        ))}
                      </div>
                      <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-8 border-t border-white/20">
                        <span className="text-lg md:text-2xl font-black uppercase tracking-widest text-slate-400">সর্বমোট টাকা:</span>
                        <span className="text-5xl md:text-7xl font-black text-blue-400 tracking-tighter leading-none">৳{totalPrice.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-10 animate-in slide-in-from-right duration-500">
                  <h3 className="text-lg md:text-xl font-black flex items-center gap-3 text-slate-900">
                    <div className="p-2 bg-blue-50 rounded-xl text-blue-600"><Check size={20} /></div>
                    ডেলিভারি ও পেমেন্ট
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                        <MapPin size={12} className="text-blue-600" /> ডেলিভারি ঠিকানা
                      </label>
                      <textarea className="w-full p-6 bg-slate-50 border-none rounded-[32px] focus:ring-2 focus:ring-blue-500 font-bold outline-none leading-relaxed" value={deliveryAddress} onChange={e => setDeliveryAddress(e.target.value)} rows={4} placeholder="যেমন: বাড়ি নং ১, রোড ২, সেক্টর ৩, উত্তরা..."></textarea>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                        <Calendar size={12} className="text-blue-600" /> ডেলিভারি তারিখ
                      </label>
                      <input type="date" className="w-full p-6 bg-slate-50 border-none rounded-[32px] focus:ring-2 focus:ring-blue-500 font-bold outline-none" value={deliveryDate} onChange={e => setDeliveryDate(e.target.value)} />
                    </div>
                    <div className="space-y-3 md:col-span-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                        <Info size={12} className="text-blue-600" /> অর্ডার স্ট্যাটাস
                      </label>
                      <div className="flex flex-wrap gap-3">
                        {Object.values(OrderStatus).map(s => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => setStatus(s)}
                            className={`px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${status === s ? 'bg-blue-600 text-white shadow-xl shadow-blue-200' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 md:px-12 py-6 md:py-10 border-t bg-slate-50/50 backdrop-blur-md flex justify-between items-center gap-4">
              <button disabled={currentStep === 1} onClick={() => setCurrentStep(prev => prev - 1)} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-8 py-4 bg-white border border-slate-100 rounded-[24px] font-black text-slate-500 disabled:opacity-30 active:scale-95 transition-all">
                <ArrowLeft size={20} /> পিছনে
              </button>
              {currentStep < 4 ? (
                <button disabled={currentStep === 1 && !selectedCustomerId} onClick={() => setCurrentStep(prev => prev + 1)} className="flex-[2] md:flex-none bg-blue-600 text-white px-12 py-4 rounded-[24px] font-black shadow-xl shadow-blue-100 hover:bg-blue-700 flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-50">
                  পরবর্তী <ChevronRight size={20} />
                </button>
              ) : (
                <button onClick={handleSubmit} className="flex-[2] md:flex-none bg-green-600 text-white px-12 py-4 rounded-[24px] font-black shadow-xl shadow-green-100 hover:bg-green-700 flex items-center justify-center gap-2 active:scale-95 transition-all">
                  অর্ডার কনফার্ম <Check size={20} />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

// Utility to handle admin layout wrapping
const AdminOrdersLayout: React.FC<{ children: React.ReactNode, user: any }> = ({ children, user }) => (
  <AdminLayout user={user} title="অর্ডারসমূহ">
    {children}
  </AdminLayout>
);

export default AdminOrders;
