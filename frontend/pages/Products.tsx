
import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Product } from '../types';
import { ShoppingCart, Package } from 'lucide-react';
import { api } from '../api';

interface Props {
  products: Product[];
}

const Products: React.FC<Props> = ({ products }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryFilter = searchParams.get('category');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const [categories, setCategories] = useState<any[]>([]);
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
    <div className="max-w-7xl mx-auto px-4 py-12 pb-24 md:pb-12">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <div className="w-full md:w-64 space-y-6">
          <h2 className="text-xl font-bold border-b pb-4">ক্যাটাগরি</h2>
          <div className="flex flex-wrap md:flex-col gap-2">
            <button
              onClick={() => setSearchParams({})}
              className={`px-4 py-2 text-left rounded-lg text-sm transition-colors font-medium ${!categoryFilter ? 'bg-blue-600 text-white' : 'bg-slate-100 hover:bg-slate-200'
                }`}
            >
              সব প্রোডাক্ট
            </button>
            {loading ? (
              <div className="px-4 py-2 text-sm text-slate-400">লোড হচ্ছে...</div>
            ) : (
              categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSearchParams({ category: cat.slug })}
                  className={`px-4 py-2 text-left rounded-lg text-sm transition-colors font-medium ${categoryFilter === cat.slug ? 'bg-blue-600 text-white' : 'bg-slate-100 hover:bg-slate-200'
                    }`}
                >
                  {cat.name}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-grow">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold">
              {categoryFilter
                ? categories.find(c => c.slug === categoryFilter)?.name || categoryFilter
                : "সব প্রোডাক্ট কালেকশন"}
              <span className="ml-3 text-sm font-normal text-slate-500">({filteredProducts.length}টি আইটেম)</span>
            </h1>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <Link
                  key={product.id}
                  to={`/products/${product.id}`}
                  className="group bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-blue-300 hover:shadow-xl transition-all"
                >
                  <div className="aspect-square relative overflow-hidden bg-slate-100">
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="text-slate-300" size={64} />
                      </div>
                    )}
                    {product.modelNo && (
                      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider text-slate-700">
                        {product.modelNo}
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <div className="text-xs text-blue-600 font-bold mb-1 uppercase tracking-tight">
                      {product.category}
                    </div>
                    <h3 className="font-bold text-lg text-slate-900 group-hover:text-blue-600 mb-2 transition-colors line-clamp-2">
                      {product.name}
                    </h3>
                    <div className="flex items-center justify-between mt-4">
                      <div className="text-lg font-black text-slate-900">
                        {product.isPillar ? (
                          <span className="text-sm font-semibold text-slate-500">বাজেট অনুযায়ী মূল্য</span>
                        ) : (
                          `৳${product.price}`
                        )}
                      </div>
                      <div className="bg-blue-50 text-blue-600 p-2 rounded-full group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <ShoppingCart size={20} />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-32 bg-gradient-to-br from-slate-50 to-blue-50 rounded-3xl border-2 border-dashed border-slate-200">
              <Package className="mx-auto text-slate-300 mb-4" size={64} />
              <p className="text-slate-600 font-medium text-lg">এই ক্যাটাগরিতে বর্তমানে কোনো প্রোডাক্ট নেই।</p>
              <button
                onClick={() => setSearchParams({})}
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                সব প্রোডাক্ট দেখুন
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
