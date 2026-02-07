
export enum UserRole {
  ADMIN = "অ্যাডমিন",
  STAFF = "স্টাফ"
}

export enum Category {
  PORCH_PILLAR = "PORCH_PILLAR",
  CLEAR_COVERING = "CLEAR_COVERING",
  FANCY_BLOCK = "FANCY_BLOCK",
  WINDOW_PILLAR = "WINDOW_PILLAR",
  BALCONY_PILLAR = "BALCONY_PILLAR",
  BALUSTER = "BALUSTER",
  ROOF_CORNICE = "ROOF_CORNICE",
  OTHER = "OTHER"
}

export interface PillarPart {
  id: string;
  name: string;
  height: string;
  price: number;
  image?: string;
}

export interface Product {
  id: string;
  name: string;
  modelNo: string;
  category: Category;
  description: string;
  images: string[];
  isPillar: boolean;
  isVisible: boolean;
  price?: number;
  pillarConfig?: {
    tops: PillarPart[];
    middlePricePerFoot: number;
    bottoms: PillarPart[];
  };
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  address: string;
  notes?: string;
  createdAt: string;
}

export enum OrderStatus {
  DRAFT = "ড্রাফট",
  CONFIRMED = "কনফার্মড",
  DELIVERED = "ডেলিভারড"
}

export interface OrderItem {
  productId: string;
  quantity: number;
  pillarFeet?: number;
  selectedTopId?: string;
  selectedBottomId?: string;
  calculatedPrice: number;
}

export interface Order {
  id: string;
  orderNo: string;
  customerId: string;
  items: OrderItem[];
  totalPrice: number;
  status: OrderStatus;
  deliveryDate: string;
  deliveryAddress: string;
  createdAt: string;
  createdBy: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  date: string;
  author: string;
  published: boolean;
}

export interface AppSettings {
  company: {
    name: string;
    tagline: string;
    address: string;
    logo: string;
    favicon: string;
  };
  contact: {
    phone: string;
    whatsapp: string;
    imo: string;
    defaultMessage: string;
  };
  invoice: {
    prefix: string;
    startNumber: number;
    terms: string[];
  };
  orders: {
    defaultStatus: OrderStatus;
    defaultDeliveryCharge: number;
  };
}

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  image?: string;
  description?: string;
  icon?: string;
}

export interface HomepageData {
  heroTitle?: string;
  heroSubtitle?: string;
  heroImage?: string;
  whatsappNumber?: string;
  imoNumber?: string;
  featuredProduct?: Product;
  features?: {
    title: string;
    description: string;
    icon: string;
  }[];
  stats?: {
    label: string;
    value: string;
    icon: string;
  }[];
  whyChooseUs?: {
    title: string;
    description: string;
    icon: string;
  }[];
  orderSteps?: {
    title: string;
    description: string;
    icon: string;
  }[];
}

export interface GlobalData {
  siteName: string;
  logo?: string;
  contactPhone?: string;
  contactEmail?: string;
  address?: string;
  facebookLink?: string;
  youtubeLink?: string;
}
