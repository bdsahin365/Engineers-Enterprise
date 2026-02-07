
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Order, Product, Customer } from '../types';
import { Hammer, Printer, ArrowLeft, MessageSquare, Phone, MapPin, CheckCircle } from 'lucide-react';
import { WHATSAPP_NUMBER, IMO_NUMBER } from '../constants';

interface Props {
  orders: Order[];
  products: Product[];
  customers: Customer[];
}

const AdminInvoices: React.FC<Props> = ({ orders, products, customers }) => {
  const { id } = useParams();
  const order = orders.find(o => o.id === id);

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 p-6">
        <div className="bg-white p-8 rounded-3xl shadow-xl text-center max-w-sm w-full">
          <h2 className="text-2xl font-black text-slate-900 mb-4">ইনভয়েস পাওয়া যায়নি</h2>
          <Link to="/admin/orders" className="text-blue-600 font-bold hover:underline">অর্ডার লিস্টে ফিরে যান</Link>
        </div>
      </div>
    );
  }

  const customer = customers.find(c => c.id === order.customerId);

  const handlePrint = () => {
    window.print();
  };

  const getPillarDescription = (item: any, product: Product) => {
    if (!product.isPillar || !product.pillarConfig) return null;
    const top = product.pillarConfig.tops.find(t => t.id === item.selectedTopId);
    const bottom = product.pillarConfig.bottoms.find(b => b.id === item.selectedBottomId);
    
    return (
      <div className="mt-1 text-[11px] text-slate-500 font-medium leading-tight">
        <p>• টপ: {top ? top.name : 'নেই'}</p>
        <p>• বডি: {item.pillarFeet} ফুট (৳{product.pillarConfig.middlePricePerFoot}/ফুট)</p>
        <p>• বেস: {bottom ? bottom.name : 'নেই'}</p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-500/10 py-0 md:py-10 no-print-bg">
      {/* Control Panel - Hidden on Print */}
      <div className="max-w-[210mm] mx-auto mb-6 px-4 no-print flex flex-col md:flex-row justify-between items-center gap-4">
        <Link to="/admin/orders" className="flex items-center text-slate-700 font-bold bg-white/80 backdrop-blur px-4 py-2 rounded-xl border hover:bg-white transition-all">
          <ArrowLeft size={18} className="mr-2" />
          অর্ডার লিস্ট
        </Link>
        <div className="flex gap-3">
          <button 
            onClick={handlePrint} 
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all active:scale-95"
          >
            <Printer size={20} /> ইনভয়েস প্রিন্ট / PDF
          </button>
          <a 
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            className="bg-green-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-green-600/20 hover:bg-green-700 transition-all active:scale-95"
          >
            <MessageSquare size={20} /> WhatsApp এ পাঠান
          </a>
        </div>
      </div>

      {/* Invoice Document (A4 Container) */}
      <div className="max-w-[210mm] mx-auto bg-white shadow-2xl overflow-hidden print:shadow-none print:w-full print:m-0" id="invoice-doc">
        <div className="p-[15mm] min-h-[297mm] flex flex-col relative">
          
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] rotate-[-45deg]">
             <h1 className="text-9xl font-black uppercase text-slate-900">Engineers</h1>
          </div>

          <div className="flex justify-between items-start border-b-2 border-slate-900 pb-8 mb-10">
            <div className="flex items-center gap-4">
              <div className="bg-slate-900 p-3 rounded-2xl text-white">
                <Hammer size={40} />
              </div>
              <div className="flex flex-col">
                <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter leading-none">Engineers Enterprise</h1>
                <p className="text-sm font-bold text-blue-600 mt-1">ডেকোরেティブ কংক্রিট পিলার ও বিল্ডিং ডিজাইন</p>
              </div>
            </div>
            <div className="text-right">
              <h2 className="text-4xl font-black text-slate-100 uppercase tracking-widest leading-none mb-4">INVOICE</h2>
              <div className="space-y-1">
                <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">ইনভয়েস নং: <span className="text-slate-900 font-mono font-black">{order.orderNo}</span></p>
                <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">তারিখ: <span className="text-slate-900">{order.createdAt}</span></p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-10 mb-10 text-sm">
            <div className="space-y-2">
              <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest border-b pb-1 mb-2">আমাদের তথ্য (Company Info)</h3>
              <div className="flex items-start gap-2 text-slate-700">
                <MapPin size={14} className="mt-0.5 text-blue-600" />
                <p className="font-bold">উত্তরা হাউজ বিল্ডিং এর পাশে, উত্তরা, ঢাকা-১২৩০।</p>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <Phone size={14} className="text-blue-600" />
                <p className="font-bold">{WHATSAPP_NUMBER}</p>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <MessageSquare size={14} className="text-green-600" />
                <p className="font-bold">WhatsApp & IMO: {IMO_NUMBER}</p>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest border-b pb-1 mb-2">গ্রাহকের তথ্য (Customer Info)</h3>
              <p className="text-xl font-black text-slate-900">{customer?.name}</p>
              <p className="font-bold text-slate-600">{customer?.phone}</p>
              <div className="flex items-start gap-2 text-slate-600 mt-1">
                <MapPin size={14} className="mt-0.5" />
                <p className="font-medium leading-snug">{order.deliveryAddress || customer?.address}</p>
              </div>
            </div>
          </div>

          <div className="flex-grow">
            <table className="w-full text-left border-collapse border-y-2 border-slate-900">
              <thead>
                <tr className="bg-slate-50">
                  <th className="py-4 px-3 text-xs font-black uppercase tracking-widest text-slate-900 border-r border-slate-200">আইটেম (Item)</th>
                  <th className="py-4 px-3 text-xs font-black uppercase tracking-widest text-slate-900 border-r border-slate-200 text-center">পরিমাণ (Qty)</th>
                  <th className="py-4 px-3 text-xs font-black uppercase tracking-widest text-slate-900 border-r border-slate-200 text-right">দর (Price)</th>
                  <th className="py-4 px-3 text-xs font-black uppercase tracking-widest text-slate-900 text-right">মোট (Total)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {order.items.map((item, idx) => {
                  const product = products.find(p => p.id === item.productId);
                  if (!product) return null;
                  return (
                    <tr key={idx} className="align-top">
                      <td className="py-5 px-3 border-r border-slate-200">
                        <div className="font-black text-slate-900 text-[15px]">{product.name}</div>
                        <div className="text-[10px] font-mono text-slate-400 font-bold mb-1 uppercase tracking-tighter">Model: {product.modelNo}</div>
                        {getPillarDescription(item, product)}
                      </td>
                      <td className="py-5 px-3 border-r border-slate-200 text-center font-bold text-slate-900">{item.quantity}</td>
                      <td className="py-5 px-3 border-r border-slate-200 text-right font-medium text-slate-700">৳{(item.calculatedPrice / item.quantity).toLocaleString()}</td>
                      <td className="py-5 px-3 text-right font-black text-slate-900">৳{item.calculatedPrice.toLocaleString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-10 flex justify-end">
            <div className="w-80 space-y-3">
              <div className="flex justify-between items-center text-slate-500 font-bold">
                <span className="text-xs uppercase tracking-widest">সাব-টোটাল (Sub Total)</span>
                <span className="text-lg">৳{order.totalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-slate-500 font-bold">
                <span className="text-xs uppercase tracking-widest">ডেলিভারি চার্জ (Delivery)</span>
                <span className="text-lg">৳০</span>
              </div>
              <div className="pt-4 mt-2 border-t-2 border-slate-900 flex justify-between items-center">
                <span className="text-sm font-black uppercase tracking-widest text-slate-900">সর্বমোট (Total Amount)</span>
                <span className="text-3xl font-black text-slate-900">৳{order.totalPrice.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-10 items-end">
            <div className="space-y-4">
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-3 flex items-center gap-2 text-slate-900">
                   <CheckCircle size={12} className="text-blue-600" /> নোট / শর্তাবলি (Notes)
                </h4>
                <ul className="text-[10px] font-bold text-slate-600 space-y-1 list-disc pl-3">
                  <li>কাস্টম ডিজাইনের পণ্য ফেরতযোগ্য নয়।</li>
                  <li>পরিবহন খরচ ও লেবার খরচ কাস্টমার বহন করবে।</li>
                  <li>রঙ ও ডিজাইনে ছবি থেকে সামান্য পার্থক্য হতে পারে।</li>
                  <li>বড় অর্ডারের ক্ষেত্রে নির্দিষ্ট অগ্রিম প্রদান বাধ্যতামূলক।</li>
                </ul>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 text-center">
              <div className="space-y-2">
                <div className="h-14"></div>
                <div className="border-t border-slate-300 pt-2">
                  <p className="text-[10px] font-black uppercase text-slate-900">Authorized Sign</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-14"></div>
                <div className="border-t border-slate-300 pt-2">
                  <p className="text-[10px] font-black uppercase text-slate-900">Customer Sign</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16 pt-8 border-t border-slate-100 text-center">
             <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Engineers Enterprise - বিশ্বস্ত কংক্রিট ডিজাইন সল্যুশন</p>
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          body { background: white !important; margin: 0; padding: 0; }
          .no-print { display: none !important; }
          .no-print-bg { background: white !important; padding: 0 !important; }
          #invoice-doc { 
            width: 210mm !important; 
            height: 297mm !important; 
            box-shadow: none !important; 
            border: none !important;
            margin: 0 !important;
          }
          @page {
            size: A4;
            margin: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminInvoices;
