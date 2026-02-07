import {
    Layout, MessageCircle, Ruler, CheckCircle2, Star, Shield,
    Truck, Clock, Award, HeartHandshake, Zap, ShieldCheck,
    Construction, Sparkles, Package, Phone, ArrowRight
} from 'lucide-react';

/**
 * Icon mapping utility for converting string icon names to Lucide React components
 * Used for dynamic icon rendering from CMS data
 */
export const iconMap: Record<string, any> = {
    Layout,
    MessageCircle,
    Ruler,
    CheckCircle2,
    Star,
    Shield,
    Truck,
    Clock,
    Award,
    HeartHandshake,
    Zap,
    ShieldCheck,
    Construction,
    Sparkles,
    Package,
    Phone,
    ArrowRight,
};

/**
 * Get icon component by name
 * @param iconName - String name of the icon
 * @param fallback - Fallback icon if name not found (default: Star)
 * @returns Lucide icon component
 */
export const getIcon = (iconName: string, fallback = Star) => {
    return iconMap[iconName] || fallback;
};
