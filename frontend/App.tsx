
import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'sonner';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Blog from './pages/Blog';
import Contact from './pages/Contact';
import AdminDashboard from './pages/AdminDashboard';
import AdminOrders from './pages/AdminOrders';
import AdminInvoices from './pages/AdminInvoices';
import AdminProducts from './pages/AdminProducts';
import AdminCustomers from './pages/AdminCustomers';
import AdminWhatsApp from './pages/AdminWhatsApp';
import AdminBlog from './pages/AdminBlog';
import AdminSettings from './pages/AdminSettings';
import AdminCategories from './pages/AdminCategories';
import AdminHomepage from './pages/AdminHomepage';
import AdminGlobalSettings from './pages/AdminGlobalSettings';
import AIDesignAssistant from './components/AIDesignAssistant';
import { Product, Order, Customer, UserRole, BlogPost } from './types';
import { api } from './api';

const App: React.FC = () => {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  // Simulation of current user
  const [currentUser] = useState({ name: 'ম্যানেজার সাহেব', role: UserRole.ADMIN });

  // State management - start empty, load from CMS
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  // Initial data fetch from Strapi
  useEffect(() => {
    const initData = async () => {
      try {
        const [strapiProducts, strapiBlogs, strapiCustomers, strapiOrders] = await Promise.all([
          api.getProducts(),
          api.getBlogs(),
          api.getCustomers(),
          api.getOrders()
        ]);

        setProducts(strapiProducts || []);
        setBlogs(strapiBlogs || []);
        setCustomers(strapiCustomers || []);
        setOrders(strapiOrders || []);
        console.log('Products set in state:', strapiProducts); // DEBUG
      } catch (error) {
        console.error('Failed to fetch data from Strapi:', error);
        // Data remains empty if CMS is unreachable
      } finally {
        setLoading(false);
      }
    };

    initData();
  }, []);

  const handleAddOrder = async (order: Order) => {
    try {
      const saved = await api.createOrder(order);
      setOrders(prev => [saved, ...prev]);
    } catch (e) {
      setOrders(prev => [order, ...prev]); // Fallback
    }
  };

  const handleAddCustomer = async (customer: Customer) => {
    try {
      const saved = await api.createCustomer(customer);
      setCustomers(prev => [saved, ...prev]);
    } catch (e) {
      setCustomers(prev => [customer, ...prev]);
    }
  };

  const handleUpdateCustomer = (updated: Customer) => {
    // Implement Strapi PUT if needed
    setCustomers(prev => prev.map(c => c.id === updated.id ? updated : c));
  };

  const handleAddProduct = async (product: Product) => {
    try {
      const saved = await api.createProduct(product);
      setProducts(prev => [saved, ...prev]);
    } catch (e) {
      setProducts(prev => [product, ...prev]);
    }
  };

  const handleUpdateProduct = async (updated: Product) => {
    try {
      const saved = await api.updateProduct(updated.id, updated);
      setProducts(prev => prev.map(p => p.id === saved.id ? saved : p));
    } catch (e) {
      setProducts(prev => prev.map(p => p.id === updated.id ? updated : p));
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      await api.deleteProduct(id);
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (e) {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  if (loading && !isAdminPath) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="font-bold text-slate-400">ইঞ্জিনিয়ার্স এন্টারপ্রাইজ লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      {!isAdminPath && <Navbar />}

      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products products={products} />} />
          <Route path="/products/:id" element={<ProductDetails products={products} />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/contact" element={<Contact />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminDashboard orders={orders} customers={customers} products={products} user={currentUser} />} />
          <Route path="/admin/orders" element={<AdminOrders orders={orders} products={products} customers={customers} onAddOrder={handleAddOrder} user={currentUser} />} />
          <Route path="/admin/customers" element={<AdminCustomers customers={customers} onAddCustomer={handleAddCustomer} onUpdateCustomer={handleUpdateCustomer} />} />
          <Route path="/admin/products" element={<AdminProducts products={products} onAddProduct={handleAddProduct} onUpdateProduct={handleUpdateProduct} onDeleteProduct={handleDeleteProduct} />} />
          <Route path="/admin/invoices/:id" element={<AdminInvoices orders={orders} products={products} customers={customers} />} />
          <Route path="/admin/blog" element={<AdminBlog blogs={blogs} onUpdateBlogs={setBlogs} />} />
          <Route path="/admin/whatsapp" element={<AdminWhatsApp orders={orders} customers={customers} />} />
          <Route path="/admin/settings" element={<AdminSettings user={currentUser} />} />
          <Route path="/admin/content/global" element={<AdminGlobalSettings />} />
        </Routes>
      </main>

      {!isAdminPath && <Footer />}
      {!isAdminPath && <AIDesignAssistant products={products} />}
      {!isAdminPath && <BottomNav />}
      <Toaster position="top-right" richColors />
    </div>
  );
};

export default App;
