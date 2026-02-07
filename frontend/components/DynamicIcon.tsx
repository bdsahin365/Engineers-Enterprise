import React from 'react';
import * as LucideIcons from 'lucide-react';

const DynamicIcon = ({ name, className, size = 24 }: { name: string; className?: string; size?: number }) => {
    // @ts-ignore
    const Icon = LucideIcons[name] || LucideIcons.HelpCircle;
    return <Icon className={className} size={size} />;
};

export default DynamicIcon;
