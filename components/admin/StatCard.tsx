'use client';

import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface StatCardProps {
    icon: LucideIcon;
    title: string;
    value: string | number;
    change?: number;
    iconColor?: string;
    iconBg?: string;
}

export default function StatCard({
    icon: Icon,
    title,
    value,
    change,
    iconColor = 'text-primary-700',
    iconBg = 'bg-primary-100',
}: StatCardProps) {
    const isPositive = change && change > 0;
    const isNegative = change && change < 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-6 shadow-md border border-primary-100 hover:shadow-lg transition-shadow"
        >
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-primary-600 text-sm font-medium mb-1">{title}</p>
                    <h3 className="text-3xl font-bold text-primary-900 mb-2">{value}</h3>
                    {change !== undefined && (
                        <div className="flex items-center gap-1">
                            <span
                                className={`text-sm font-medium ${isPositive
                                    ? 'text-green-600'
                                    : isNegative
                                        ? 'text-red-500'
                                        : 'text-primary-600'
                                    }`}
                            >
                                {isPositive && '+'}
                                {change}%
                            </span>
                            <span className="text-xs text-primary-400">vs last month</span>
                        </div>
                    )}
                </div>

                <div className={`${iconBg} p-3 rounded-lg`}>
                    <Icon className={`h-6 w-6 ${iconColor}`} />
                </div>
            </div>
        </motion.div>
    );
}
