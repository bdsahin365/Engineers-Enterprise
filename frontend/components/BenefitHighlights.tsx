import React from 'react';
import { ShieldCheck, Award, Truck, Sparkles, LucideIcon } from 'lucide-react';

interface Benefit {
    icon: LucideIcon;
    title: string;
    desc: string;
    color: string;
    bg: string;
}

const benefits: Benefit[] = [
    { icon: ShieldCheck, title: "মজবুত ও টেকসই", desc: "প্রিমিয়াম কংক্রিট", color: "text-blue-600", bg: "bg-blue-50" },
    { icon: Award, title: "নিখুঁত ফিনিশিং", desc: "অভিজ্ঞ কারিগর", color: "text-orange-600", bg: "bg-orange-50" },
    { icon: Truck, title: "সারাদেশে ডেলিভারি", desc: "নিরাপদ পরিবহন", color: "text-green-600", bg: "bg-green-50" },
    { icon: Sparkles, title: "মর্ডান ডিজাইন", desc: "আধুনিক লুক", color: "text-purple-600", bg: "bg-purple-50" },
];

const BenefitHighlights: React.FC = () => {
    return (
        <div className="grid grid-cols-2 gap-4">
            {benefits.map((b, i) => (
                <div key={i} className={`${b.bg} p-4 md:p-5 rounded-3xl border border-white shadow-sm flex items-start gap-3 md:gap-4`}>
                    <div className={`${b.color} p-2 bg-white rounded-2xl shadow-sm`}><b.icon size={18} /></div>
                    <div>
                        <p className="font-black text-slate-900 text-xs md:text-sm">{b.title}</p>
                        <p className="text-[9px] md:text-[10px] font-bold text-slate-500 uppercase tracking-tighter">{b.desc}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default BenefitHighlights;
