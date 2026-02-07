
import { Category, Product, BlogPost, Customer, Order, OrderStatus } from './types';

export const WHATSAPP_NUMBER = "+8801XXXXXXXXX";
export const IMO_NUMBER = "+8801XXXXXXXXX";

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "প্রিমিয়াম পোরচ পিলার - মডেল এ১",
    modelNo: "EE-PP-001",
    category: Category.PORCH_PILLAR,
    description: "এটি একটি আধুনিক ডিজাইনের পোরচ পিলার যা আপনার বাড়ির সৌন্দর্য বহুগুণ বাড়িয়ে দিবে। উচ্চমানের কংক্রিট দিয়ে তৈরি এবং নিখুঁত ফিনিশিং নিশ্চিত করা হয়েছে।",
    images: ["https://images.unsplash.com/photo-1590069230002-70cc83815b21?auto=format&fit=crop&q=80&w=800", "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800"],
    isPillar: true,
    isVisible: true,
    pillarConfig: {
      tops: [
        { id: "t1", name: "ক্লাসিক রাউন্ড টপ", height: "১ ফুট", price: 1500, image: "https://images.unsplash.com/photo-1628595351029-c2bf17511435?auto=format&fit=crop&q=80&w=200" },
        { id: "t2", name: "স্কয়ার কার্ভড টপ", height: "১.২ ফুট", price: 1800, image: "https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?auto=format&fit=crop&q=80&w=200" }
      ],
      middlePricePerFoot: 450,
      bottoms: [
        { id: "b1", name: "স্ট্যান্ডার্ড বেস", height: "১.৫ ফুট", price: 2000, image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=200" },
        { id: "b2", name: "ডিজাইনার হেভি বেস", height: "২ ফুট", price: 2800, image: "https://images.unsplash.com/photo-1505330622279-bf7d7fc918f4?auto=format&fit=crop&q=80&w=200" }
      ]
    }
  },
  {
    id: "p2",
    name: "ফ্যান্সি ওয়াল ব্লক - ফ্লোরাল",
    modelNo: "EE-FB-012",
    category: Category.FANCY_BLOCK,
    description: "বাউন্ডারি ওয়াল বা ঘরের ভেতরে ডেকোরেশনের জন্য চমৎকার ফ্লোরাল ডিজাইন। এটি বাতাস চলাচলের সুব্যবস্থা রাখে এবং গোপনীয়তা বজায় রাখে।",
    images: ["https://images.unsplash.com/photo-1523413555809-0fb8a4a2c00d?auto=format&fit=crop&q=80&w=800"],
    isPillar: false,
    isVisible: true,
    price: 85
  },
  {
    id: "p3",
    name: "ব্যালকনি রেলিং পিলার",
    modelNo: "EE-BP-005",
    category: Category.BALCONY_PILLAR,
    description: "ব্যালকনির জন্য টেকসই এবং নান্দনিক পিলার ডিজাইন। আপনার ঘরকে দিবে আভিজাত্যের ছোঁয়া।",
    images: ["https://images.unsplash.com/photo-1590644365607-1c5a519a7a37?auto=format&fit=crop&q=80&w=800"],
    isPillar: true,
    isVisible: true,
    pillarConfig: {
      tops: [{ id: "t3", name: "স্মল গম্বুজ টপ", height: "০.৫ ফুট", price: 800, image: "https://images.unsplash.com/photo-1628595351029-c2bf17511435?auto=format&fit=crop&q=80&w=200" }],
      middlePricePerFoot: 300,
      bottoms: [{ id: "b3", name: "ব্যালকনি বেস", height: "০.৫ ফুট", price: 800, image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=200" }]
    }
  }
];

export const MOCK_BLOGS: BlogPost[] = [
  {
    id: "b1",
    title: "কেন ডেকোরেティブ কংক্রিট পিলার আপনার বাড়ির জন্য সেরা পছন্দ?",
    excerpt: "বাড়ির সামনের সৌন্দর্য বাড়াতে পিলারের ভূমিকা অপরিসীম। জানুন কেন কংক্রিট পিলার সেরা এবং সাশ্রয়ী।",
    content: "বিস্তারিত আলোচনা করা হয়েছে কীভাবে কংক্রিট পিলার আপনার খরচ বাঁচায় এবং টেকসই সৌন্দর্য দেয়। আধুনিক স্থাপত্যবিদরা কেন এখন এগুলো রিকমেন্ড করছেন...",
    image: "https://images.unsplash.com/photo-1541888946425-d81bb19480c5?auto=format&fit=crop&q=80&w=800",
    date: "২০ মে ২০২৪",
    author: "ইঞ্জিনিয়ার্স এন্টারপ্রাইজ টিম",
    published: true
  }
];

export const MOCK_CUSTOMERS: Customer[] = [
  { id: "c1", name: "করিম উদ্দিন", phone: "01711122233", address: "উত্তরা, ঢাকা", notes: "পুরানো কাস্টমার, ৩টি পিলারের অর্ডার দিয়েছিলেন আগে।", createdAt: "2024-05-01" },
  { id: "c2", name: "রহিমা বেগম", phone: "01811122233", address: "সাভার, ঢাকা", notes: "নতুন বাউন্ডারি ওয়ালের কাজ চলছে।", createdAt: "2024-05-01" }
];

export const MOCK_ORDERS: Order[] = [
  {
    id: "o1",
    orderNo: "ORD-1001",
    customerId: "c1",
    items: [
      { 
        productId: "p1", 
        quantity: 4, 
        pillarFeet: 10, 
        selectedTopId: "t1", 
        selectedBottomId: "b1", 
        calculatedPrice: 32000 
      }
    ],
    totalPrice: 32000,
    status: OrderStatus.CONFIRMED,
    deliveryDate: "২০২৪-০৬-১৫",
    deliveryAddress: "উত্তরা, সেক্টর ৪, ঢাকা",
    createdAt: "২০২৪-০৫-২৪",
    createdBy: "Admin"
  }
];
