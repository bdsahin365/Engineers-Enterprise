
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, Edit2, X, Check, Eye
} from 'lucide-react';
import { BlogPost } from '../types';
import AdminLayout from '../components/AdminLayout';

interface Props {
  blogs: BlogPost[];
  onUpdateBlogs: (blogs: BlogPost[]) => void;
}

const AdminBlog: React.FC<Props> = ({ blogs, onUpdateBlogs }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    image: 'https://picsum.photos/seed/blog/800/400',
    published: true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingBlog) {
      onUpdateBlogs(blogs.map(b => b.id === editingBlog.id ? { ...b, ...formData } : b));
    } else {
      const newBlog: BlogPost = {
        ...formData,
        id: 'b' + Date.now(),
        date: new Date().toLocaleDateString('bn-BD'),
        author: 'ম্যানেজার সাহেব'
      };
      onUpdateBlogs([...blogs, newBlog]);
    }
    setIsModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({ title: '', excerpt: '', content: '', image: 'https://picsum.photos/seed/blog/800/400', published: true });
    setEditingBlog(null);
  };

  const openEdit = (b: BlogPost) => {
    setEditingBlog(b);
    setFormData({ title: b.title, excerpt: b.excerpt, content: b.content, image: b.image, published: b.published });
    setIsModalOpen(true);
  };

  const user = { name: 'ম্যানেজার সাহেব', role: 'অ্যাডমিন' };

  return (
    <AdminLayout user={user as any} title="ব্লগ ম্যানেজমেন্ট">
      <div className="space-y-6">
        <div className="flex justify-end">
          <button 
            onClick={() => setIsModalOpen(true)} 
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg flex items-center gap-2 active:scale-95 transition-all"
          >
            <Plus size={20} /> নতুন ব্লগ
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
           {blogs.map(b => (
             <div key={b.id} className="bg-white rounded-[24px] md:rounded-[32px] overflow-hidden border shadow-sm group">
                <div className="h-40 md:h-48 overflow-hidden relative">
                   <img src={b.image} alt="" className="w-full h-full object-cover" />
                   <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black uppercase shadow-sm">
                    {b.published ? 'Published' : 'Draft'}
                   </div>
                </div>
                <div className="p-6 md:p-8">
                   <h3 className="text-lg md:text-xl font-black text-slate-900 mb-2 leading-tight">{b.title}</h3>
                   <p className="text-xs md:text-sm text-slate-500 line-clamp-2 mb-6 font-medium">{b.excerpt}</p>
                   <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                      <button onClick={() => openEdit(b)} className="text-blue-600 font-bold text-sm flex items-center gap-1.5 hover:gap-2 transition-all">
                        <Edit2 size={16} /> এডিট করুন
                      </button>
                      <Link to="/blog" className="p-2 bg-slate-50 rounded-xl text-slate-400 hover:text-blue-600 transition-colors">
                        <Eye size={20} />
                      </Link>
                   </div>
                </div>
             </div>
           ))}
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-0 md:p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
            <div className="bg-white w-full h-full md:h-auto md:rounded-[40px] md:max-w-2xl md:max-h-[90vh] p-6 md:p-10 relative shadow-2xl flex flex-col">
               <div className="flex justify-between items-center mb-8 md:mb-10">
                  <h2 className="text-xl md:text-2xl font-black text-slate-900">{editingBlog ? 'ব্লগ এডিট করুন' : 'নতুন ব্লগ'}</h2>
                  <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={24} /></button>
               </div>
               <form onSubmit={handleSubmit} className="space-y-6 overflow-y-auto flex-grow">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">শিরোনাম (Bangla)</label>
                     <input required type="text" className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold outline-none" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">সংক্ষিপ্ত বিবরণ</label>
                     <input required type="text" className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold outline-none" value={formData.excerpt} onChange={e => setFormData({...formData, excerpt: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">মূল কন্টেন্ট</label>
                     <textarea required className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold outline-none" value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} rows={10}></textarea>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
                     <label className="text-sm font-bold text-slate-700">পাবলিশ করুন?</label>
                     <input type="checkbox" checked={formData.published} onChange={e => setFormData({...formData, published: e.target.checked})} className="w-6 h-6 rounded text-blue-600 focus:ring-blue-500" />
                  </div>
                  <button type="submit" className="w-full bg-slate-900 text-white py-5 rounded-[24px] font-black text-lg shadow-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2 mt-4">
                    <Check size={24} /> সেভ করুন
                  </button>
               </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminBlog;
