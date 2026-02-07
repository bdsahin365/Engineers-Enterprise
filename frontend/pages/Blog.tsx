
import React from 'react';
import { MOCK_BLOGS } from '../constants';
import { Calendar, User, ArrowRight } from 'lucide-react';

const Blog: React.FC = () => {
  return (
    <div className="bg-slate-50 min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">নির্মাণ ব্লগ ও টিপস</h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            বাড়ি নির্মাণে সঠিক সিদ্ধান্ত নিতে এবং আধুনিক ডিজাইন সম্পর্কে জানতে আমাদের ব্লগে চোখ রাখুন
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {MOCK_BLOGS.map((blog) => (
            <div key={blog.id} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-slate-100 group">
              <div className="h-64 relative overflow-hidden">
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="p-8">
                <div className="flex items-center gap-6 text-xs text-slate-400 font-bold uppercase mb-4 tracking-wider">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={14} className="text-blue-500" />
                    {blog.date}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <User size={14} className="text-blue-500" />
                    {blog.author}
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-blue-600 transition-colors leading-tight">
                  {blog.title}
                </h2>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  {blog.excerpt}
                </p>
                <button className="inline-flex items-center font-bold text-blue-600 hover:text-blue-800 transition-colors">
                  বিস্তারিত পড়ুন <ArrowRight size={16} className="ml-2" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blog;
