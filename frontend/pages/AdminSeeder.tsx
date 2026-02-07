import React, { useState } from 'react';
import { Database, Check, AlertCircle, Loader2 } from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import { api } from '../api';
import { MOCK_PRODUCTS, MOCK_BLOGS, MOCK_CUSTOMERS, MOCK_ORDERS, WHATSAPP_NUMBER, IMO_NUMBER } from '../constants';
import { toast } from 'sonner';

export default function AdminSeeder() {
    const [loading, setLoading] = useState(false);
    const [logs, setLogs] = useState<string[]>([]);

    const addLog = (msg: string) => setLogs(prev => [...prev, msg]);

    const urlToFile = async (url: string, filename: string): Promise<File> => {
        const res = await fetch(url);
        const blob = await res.blob();
        return new File([blob], filename, { type: blob.type });
    };

    const seedContent = async () => {
        if (!confirm("This will upload all mock data to Strapi. Continue?")) return;

        setLoading(true);
        setLogs([]);
        addLog("🚀 Starting seeding process...");

        try {
            // 1. Global Settings
            try {
                addLog("🌍 Updating Global Settings...");
                await api.updateGlobal({
                    siteName: "Engineers Enterprise",
                    contactPhone: WHATSAPP_NUMBER,
                    contactEmail: "info@engineersenterprise.com",
                    address: "Dhaka, Bangladesh",
                    facebookLink: "https://facebook.com",
                    youtubeLink: "https://youtube.com"
                });
                addLog("✅ Global Settings updated.");
            } catch (e: any) {
                addLog(`❌ Failed to update Global Settings: ${e.message}`);
            }

            // 2. Homepage
            try {
                addLog("🏠 Updating Homepage...");
                // Try to upload hero image if possible, or just skip for now
                await api.updateHomepage({
                    heroTitle: "ডেকোরেটিভ কংক্রিট পিলার ও বিল্ডিং ডিজাইন",
                    heroSubtitle: "মজবুত, টেকসই ও প্রিমিয়াম কংক্রিট কাজ।",
                    whatsappNumber: WHATSAPP_NUMBER,
                    imoNumber: IMO_NUMBER,
                    whyChooseUs: [
                        { title: "নিজস্ব কারখানায় তৈরি", description: "আমাদের সকল পণ্য নিজস্ব কারখানায় অভিজ্ঞ কারিগর দ্বারা তৈরি।", icon: "CheckCircle2" },
                        { title: "দীর্ঘস্থায়ী স্থায়িত্ব", description: "সেরা মানের সিমেন্ট ও রড ব্যবহার করায় আমাদের পণ্য দীর্ঘস্থায়ী।", icon: "Shield" },
                        { title: "আধুনিক ডিজাইন", description: "সময়ের সাথে তাল মিলিয়ে আমরা প্রতিনিয়ত নতুন ডিজাইন নিয়ে আসি।", icon: "Star" }
                    ],
                    orderSteps: [
                        { title: "পছন্দের পণ্য দেখুন", description: "আমাদের গ্যালারি থেকে আপনার পছন্দের ডিজাইনটি বাছাই করুন।", icon: "Layout" },
                        { title: "সরাসরি যোগাযোগ", description: "WhatsApp বা IMO-তে আমাদের সাথে কথা বলে বিস্তারিত জেনে নিন।", icon: "MessageCircle" },
                        { title: "মাপ ও পরিমাণ", description: "আপনার প্রয়োজনীয় সাইজ এবং কত পিস লাগবে তা আমাদের জানান।", icon: "Ruler" },
                        { title: "অর্ডার সম্পন্ন", description: "দাম এবং ডেলিভারি সময় কনফার্ম করে অর্ডারটি নিশ্চিত করুন।", icon: "CheckCircle2" }
                    ]
                });
                addLog("✅ Homepage updated.");
            } catch (e: any) {
                addLog(`❌ Failed to update Homepage: ${e.message}`);
            }

            // 3. Categories
            addLog("📂 Creating Categories...");
            const categories = [...new Set(MOCK_PRODUCTS.map(p => p.category))];
            const categoryMap = new Map<string, string>(); // Name -> ID

            for (const catName of categories) {
                try {
                    const existing = await api.getCategories();
                    const found = existing.find(c => c.name === catName);

                    if (found) {
                        categoryMap.set(catName, found.id);
                        addLog(`ℹ️ Category '${catName}' already exists.`);
                    } else {
                        const newCat = await api.createCategory({
                            name: catName,
                            slug: catName.toLowerCase().replace(/ /g, '-'),
                            icon: 'Layout',
                            description: `${catName} collection`
                        });
                        categoryMap.set(catName, newCat.id);
                        addLog(`✅ Created Category: ${catName}`);
                    }
                } catch (e) {
                    addLog(`❌ Failed to create category ${catName}`);
                }
            }

            // 4. Products
            addLog("📦 Creating Products...");
            const productMap = new Map<string, string>(); // MockID -> RealID

            for (const product of MOCK_PRODUCTS) {
                try {
                    let imageIds: number[] = [];
                    // Upload images
                    if (product.images && product.images.length > 0) {
                        addLog(`   Transferring images for ${product.name}...`);
                        for (let i = 0; i < product.images.length; i++) {
                            const imgUrl = product.images[i];
                            try {
                                const file = await urlToFile(imgUrl, `product-${product.id}-${i}.jpg`);
                                const id = await api.uploadFileAndGetId(file);
                                imageIds.push(id);
                            } catch (e) {
                                console.error("Failed to upload image", e);
                            }
                        }
                    }

                    const categoryId = categoryMap.get(product.category); // Currently category is an enum/string in mock
                    // Note: In Strapi, relations need ID. If categoryMap has IDs, we use it. 
                    // BUT api.createProduct expects `category: id` or `category: {id: ...}`? 
                    // Standard Strapi create via JSON: `category: id`

                    const newProduct = await api.createProduct({
                        ...product,
                        images: imageIds as any, // ID array for relation
                        category: categoryId as any,
                        id: undefined // Let Strapi generate ID
                    });
                    productMap.set(product.id, newProduct.id);
                    addLog(`✅ Created Product: ${product.name}`);
                } catch (e) {
                    console.error(e);
                    addLog(`❌ Failed to create product ${product.name}`);
                }
            }

            // 5. Blogs
            addLog("📝 Creating Blog Posts...");
            for (const blog of MOCK_BLOGS) {
                try {
                    let imageId: number | undefined;
                    if (blog.image) {
                        const file = await urlToFile(blog.image, `blog-${blog.id}.jpg`);
                        imageId = await api.uploadFileAndGetId(file);
                    }

                    await api.createBlogPost({
                        title: blog.title,
                        content: blog.content,
                        excerpt: blog.excerpt,
                        // @ts-ignore
                        image: imageId,
                        author: blog.author,
                        date: blog.date,
                        published: true
                    });
                    addLog(`✅ Created Blog: ${blog.title}`);
                } catch (e) {
                    addLog(`❌ Failed to create blog ${blog.title}`);
                }
            }

            // 6. Customers
            addLog("👥 Creating Customers...");
            const customerMap = new Map<string, string>();
            for (const customer of MOCK_CUSTOMERS) {
                try {
                    const newCustomer = await api.createCustomer({
                        name: customer.name,
                        phone: customer.phone,
                        address: customer.address,
                        notes: customer.notes
                    });
                    customerMap.set(customer.id, newCustomer.id);
                    addLog(`✅ Created Customer: ${customer.name}`);
                } catch (e) {
                    addLog(`❌ Failed to create customer ${customer.name}`);
                }
            }

            // 7. Orders
            addLog("🛍️ Creating Orders...");
            for (const order of MOCK_ORDERS) {
                try {
                    const realCustomerId = customerMap.get(order.customerId);

                    // Map items
                    const realItems = order.items.map(item => ({
                        ...item,
                        productId: productMap.get(item.productId) || item.productId
                    }));

                    if (realCustomerId) {
                        await api.createOrder({
                            ...order,
                            // @ts-ignore
                            customer: realCustomerId,
                            items: realItems,
                            id: undefined
                        });
                        addLog(`✅ Created Order: ${order.orderNo}`);
                    } else {
                        addLog(`⚠️ Skipped Order ${order.orderNo} (Customer not found)`);
                    }
                } catch (e) {
                    addLog(`❌ Failed to create order ${order.orderNo}`);
                }
            }

            addLog("✨ Seeding Completed!");
            toast.success("Seeding completed successfully!");

        } catch (error: any) {
            console.error(error);
            addLog(`❌ Critical Seeding Error: ${error.message}`);
            toast.error(`Seeding failed: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const user = { name: 'Admin', role: 'System' };

    return (
        <AdminLayout user={user as any} title="Content Seeder">
            <div className="max-w-2xl mx-auto space-y-6">
                <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100 text-center space-y-4">
                    <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto text-blue-600 mb-4">
                        <Database size={40} />
                    </div>
                    <h2 className="text-2xl font-black text-slate-900">Seed Content to Strapi</h2>
                    <p className="text-slate-500 font-medium max-w-md mx-auto">
                        This tool will migrate all hardcoded content (Products, Categories, Blogs, Settings) from the frontend to your Strapi CMS.
                    </p>

                    <div className="flex items-center justify-center gap-2 p-4 bg-orange-50 text-orange-700 rounded-2xl text-sm font-bold">
                        <AlertCircle size={18} />
                        <span>Existing data may be duplicated if run multiple times.</span>
                    </div>

                    <button
                        onClick={seedContent}
                        disabled={loading}
                        className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-lg shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 w-full"
                    >
                        {loading ? <Loader2 size={24} className="animate-spin" /> : <Database size={24} />}
                        {loading ? "Seeding..." : "Start Migration"}
                    </button>
                </div>

                {logs.length > 0 && (
                    <div className="bg-slate-900 text-slate-300 p-6 rounded-3xl font-mono text-xs max-h-[400px] overflow-y-auto space-y-1">
                        {logs.map((log, i) => (
                            <div key={i} className="border-b border-white/5 pb-1 mb-1 last:border-0">{log}</div>
                        ))}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
