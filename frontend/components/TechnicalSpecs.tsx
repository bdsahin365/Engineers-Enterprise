import React from 'react';
import { FileText, ShieldCheck, Clock, Gauge, Box } from 'lucide-react';

const TechnicalSpecs: React.FC = () => {
    return (
        <div className="mb-10 p-8 md:p-10 bg-slate-900 text-white rounded-[40px] shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <FileText size={120} />
            </div>

            <h4 className="text-sm font-black uppercase tracking-widest mb-8 flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-600/20 flex items-center justify-center">
                    <FileText size={18} className="text-blue-400" />
                </div>
                টেকনিক্যাল স্পেসিফিকেশন
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6">
                {[
                    { icon: ShieldCheck, label: "ম্যাটেরিয়াল", value: "হাই-গ্রেড কংক্রিট (পাথর ঢালাই)" },
                    { icon: Gauge, label: "ফিনিশিং", value: "স্মুথ অ্যান্ড প্রিমিয়াম" },
                    { icon: Clock, label: "স্থায়িত্ব", value: "৫০+ বছর" },
                    { icon: Box, label: "ব্যবহার", value: "আউটডোর ও ইনডোর" },
                ].map((spec, i) => (
                    <div key={i} className="flex items-center gap-4 group/item">
                        <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-blue-400 group-hover/item:bg-blue-600 group-hover/item:text-white transition-all">
                            <spec.icon size={20} />
                        </div>
                        <div>
                            <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-0.5">{spec.label}</div>
                            <div className="text-sm font-black text-white">{spec.value}</div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 pt-6 border-t border-white/5 flex items-center gap-3 text-xs font-bold text-slate-400">
                <ShieldCheck size={16} className="text-green-500" />
                বিএসটিআই মানসম্মত কাঁচামাল দ্বারা সুনিশ্চিত।
            </div>
        </div>
    );
};

export default TechnicalSpecs;
