
import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Product, CategoryItem } from '../types';
import { ShoppingCart, Package, Search, Filter } from 'lucide-react';
import { api } from '../api';

interface Props {
  products: Product[];
}

const Products: React.FC<Props> = ({ products }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryFilter = searchParams.get('category');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch categories from CMS
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await api.getCategories();
        setCategories(data || []);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (categoryFilter) {
      setFilteredProducts(products.filter(p => p.category === categoryFilter));
    } else {
      setFilteredProducts(products);
    }
  }, [categoryFilter, products]);

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12 pb-24 md:pb-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-72 space-y-8">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
              <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
                <Filter size={20} className="text-blue-600" /> ক্যাটাগরি
              </h2>
              <div className="flex flex-wrap lg:flex-col gap-2">
                <button
                  onClick={() => setSearchParams({})}
                  className={`px-5 py-3 text-left rounded-2xl text-sm transition-all font-bold flex items-center justify-between group ${!categoryFilter ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'bg-slate-50 text-slate-600 hover:bg-white hover:shadow-md'
                    }`}
                >
                  সব প্রোডাক্ট
                  {!categoryFilter && <div className="w-1.5 h-1.5 rounded-full bg-white opacity-50"></div>}
                </button>
                {loading ? (
                  <div className="space-y-2 mt-2">
                    {[1, 2, 3, 4].map(i => <div key={i} className="h-10 bg-slate-100 rounded-2xl animate-pulse"></div>)}
                  </div>
                ) : (
                  categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSearchParams({ category: cat.slug })}
                      className={`px-5 py-3 text-left rounded-2xl text-sm transition-all font-bold flex items-center justify-between group ${categoryFilter === cat.slug ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'bg-slate-50 text-slate-600 hover:bg-white hover:shadow-md'
                        }`}
                    >
                      {cat.name}
                      {categoryFilter === cat.slug && <div className="w-1.5 h-1.5 rounded-full bg-white opacity-50"></div>}
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Support Box */}
            <div className="bg-slate-900 p-6 rounded-3xl text-white relative overflow-hidden group shadow-xl">
              <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-125 transition-transform duration-700">
                <Search size={120} />
              </div>
              <p className="text-xs font-black text-blue-400 uppercase tracking-[0.2em] mb-2">সহায়তা প্রয়োজন?</p>
              <h3 className="text-lg font-black mb-4 leading-tight">পছন্দের ডিজাইন পাচ্ছেন না? সরাসরি কল দিন।</h3>
              <a href="tel:01711111111" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-black transition-colors inline-block relative z-10">কল করুন</a>
            </div>
          </aside>

          {/* Product Grid */}
          <main className="flex-grow">
            <div className="flex items-end justify-between mb-8 pb-4 border-b border-slate-200">
              <div>
                <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                  {categoryFilter
                    ? categories.find(c => c.slug === categoryFilter)?.name || categoryFilter
                    : "সব প্রোডাক্ট কালেকশন"}
                </h1>
                <p className="text-slate-500 font-bold mt-1">{filteredProducts.length}টি চমৎকার ডিজাইন আপনার অপেক্ষায়</p>
              </div>
            </div>

            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
                {filteredProducts.map((product) => (
                  <Link
                    key={product.id}
                    to={`/products/${product.id}`}
                    className="group bg-white rounded-[32px] overflow-hidden border border-slate-100 hover:border-blue-200 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-500"
                  >
                    <div className="aspect-[4/5] relative overflow-hidden bg-slate-50">
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="text-slate-200" size={80} strokeWidth={1} />
                        </div>
                      )}

                      {/* Floating Badge */}
                      <div className="absolute top-4 left-4 flex flex-col gap-2">
                        {product.modelNo && (
                          <div className="bg-white/90 backdrop-blur px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-900 shadow-xl border border-white">
                            {product.modelNo}
                          </div>
                        )}
                        {product.isPillar && (
                          <div className="bg-blue-600 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-white shadow-xl">
                            Pillar
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="p-6 md:p-8">
                      <div className="text-[10px] text-blue-600 font-black mb-2 uppercase tracking-widest">
                        {product.category}
                      </div>
                      <h3 className="font-black text-xl text-slate-900 group-hover:text-blue-600 mb-6 transition-colors line-clamp-2 leading-tight">
                        {product.name}
                      </h3>

                      <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">প্রারম্ভিক মূল্য</p>
                          <p className="text-2xl font-black text-slate-900 leading-none">
                            {product.isPillar ? (
                              <span className="text-blue-600 flex items-center gap-1.5">বাজেট অনুযায়ী <Filter size={14} /></span>
                            ) : (
                              `৳${product.price}`
                            )}
                          </p>
                        </div>
                        <div className="bg-slate-50 text-slate-400 p-4 rounded-2xl group-hover:bg-blue-600 group-hover:text-white group-hover:shadow-lg transition-all duration-300">
                          <ShoppingCart size={22} />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-32 bg-white rounded-[40px] border-2 border-dashed border-slate-100 shadow-inner">
                <Package className="mx-auto text-slate-200 mb-6" size={100} strokeWidth={1} />
                <h3 className="text-2xl font-black text-slate-900 mb-2">কিছু পাওয়া যায়নি</h3>
                <p className="text-slate-500 font-medium text-lg mb-8">এই ক্যাটাগরিতে বর্তমানে কোনো প্রোডাক্ট নেই।</p>
                <button
                  onClick={() => setSearchParams({})}
                  className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 active:scale-95"
                >
                  সব প্রোডাক্ট দেখুন
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Products;

