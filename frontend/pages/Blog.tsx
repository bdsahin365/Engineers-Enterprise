
import React from 'react';
import { Calendar, User, ArrowRight, BookOpen } from 'lucide-react';
import { api } from '../api';
import { BlogPost } from '../types';

const Blog: React.FC = () => {
  const [blogs, setBlogs] = React.useState<BlogPost[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const data = await api.getBlogs();
        setBlogs(data || []);
      } catch (error) {
        console.error("Failed to fetch blogs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <div className="bg-slate-50 min-h-screen py-20 pb-24 md:pb-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-extrabold text-slate-900 mb-4">নির্মাণ ব্লগ ও টিপস</h1>
            <p className="text-slate-600 max-w-2xl mx-auto">
              বাড়ি নির্মাণে সঠিক সিদ্ধান্ত নিতে এবং আধুনিক ডিজাইন সম্পর্কে জানতে আমাদের ব্লগে চোখ রাখুন
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 animate-pulse">
                <div className="h-64 bg-slate-200"></div>
                <div className="p-8 space-y-4">
                  <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                  <div className="h-6 bg-slate-200 rounded"></div>
                  <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-20 pb-24 md:pb-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">নির্মাণ ব্লগ ও টিপস</h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            বাড়ি নির্মাণে সঠিক সিদ্ধান্ত নিতে এবং আধুনিক ডিজাইন সম্পর্কে জানতে আমাদের ব্লগে চোখ রাখুন
          </p>
        </div>

        {blogs.length === 0 ? (
          <div className="text-center py-32 bg-gradient-to-br from-white to-slate-100 rounded-3xl border-2 border-dashed border-slate-200">
            <BookOpen className="mx-auto text-slate-300 mb-4" size={64} />
            <p className="text-slate-600 font-medium text-lg mb-2">এখনো কোনো ব্লগ পোস্ট নেই।</p>
            <p className="text-slate-400 text-sm">শীঘ্রই নতুন কন্টেন্ট যুক্ত হবে।</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {blogs.map((blog) => (
              <div key={blog.id} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-slate-100 group">
                <div className="h-64 relative overflow-hidden">
                  {blog.image ? (
                    <img
                      src={blog.image}
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-100 to-slate-100 flex items-center justify-center">
                      <BookOpen className="text-slate-300" size={64} />
                    </div>
                  )}
                </div>
                <div className="p-8">
                  <div className="flex items-center gap-6 text-xs text-slate-400 font-bold uppercase mb-4 tracking-wider">
                    {blog.date && (
                      <div className="flex items-center gap-1.5">
                        <Calendar size={14} className="text-blue-500" />
                        {blog.date}
                      </div>
                    )}
                    {blog.author && (
                      <div className="flex items-center gap-1.5">
                        <User size={14} className="text-blue-500" />
                        {blog.author}
                      </div>
                    )}
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-blue-600 transition-colors leading-tight line-clamp-2">
                    {blog.title}
                  </h2>
                  <p className="text-slate-600 mb-6 leading-relaxed line-clamp-3">
                    {blog.excerpt}
                  </p>
                  <button className="inline-flex items-center font-bold text-blue-600 hover:text-blue-800 transition-colors">
                    বিস্তারিত পড়ুন <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;
