'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import {
    LayoutDashboard,
    Heart,
    Calendar,
    Eye,
    Bell,
    Settings,
    LogOut,
    ChevronLeft,
    ChevronRight,
    Home,
    Building2,
    Plus,
    BarChart3,
    MessageSquare,
    LucideIcon,
} from 'lucide-react';

interface MenuItem {
    icon: LucideIcon;
    label: string;
    href: string;
}

interface DashboardSidebarProps {
    collapsed?: boolean;
    setCollapsed?: (collapsed: boolean) => void;
    role?: 'user' | 'owner';
    userRole?: 'user' | 'owner';
    userName?: string;
    userEmail?: string;
}

const userMenuItems: MenuItem[] = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard/user' },
    { icon: Heart, label: 'Wishlist', href: '/dashboard/user/wishlist' },
    { icon: Calendar, label: 'Book Appointments', href: '/dashboard/user/bookings' },
    { icon: Eye, label: 'Recently Viewed', href: '/dashboard/user/history' },
    { icon: Bell, label: 'Notifications', href: '/dashboard/user/notifications' },
    { icon: Settings, label: 'Settings', href: '/dashboard/user/settings' },
];

const ownerMenuItems: MenuItem[] = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard/owner' },
    { icon: Building2, label: 'My Properties', href: '/dashboard/owner/properties' },
    { icon: Plus, label: 'Add Property', href: '/dashboard/owner/properties/new' },
    { icon: Calendar, label: 'Meetings', href: '/dashboard/owner/meetings' },
    { icon: BarChart3, label: 'Analytics', href: '/dashboard/owner/analytics' },
    { icon: MessageSquare, label: 'Messages', href: '/dashboard/owner/messages' },
    { icon: Settings, label: 'Settings', href: '/dashboard/owner/settings' },
];

export default function DashboardSidebar({
    collapsed: controlledCollapsed,
    setCollapsed: controlledSetCollapsed,
    role,
    userRole,
}: DashboardSidebarProps) {
    const [internalCollapsed, setInternalCollapsed] = useState(false);

    // Use controlled state if provided, otherwise use internal state
    const collapsed = controlledCollapsed !== undefined ? controlledCollapsed : internalCollapsed;
    const setCollapsed = controlledSetCollapsed || setInternalCollapsed;

    // Support both 'role' and 'userRole' props
    const effectiveRole = role || userRole || 'user';
    const pathname = usePathname();
    const router = useRouter();
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    const menuItems = effectiveRole === 'owner' ? ownerMenuItems : userMenuItems;
    const dashboardTitle = effectiveRole === 'owner' ? 'Owner Panel' : 'User Panel';

    return (
        <motion.aside
            initial={false}
            animate={{ width: collapsed ? 80 : 280 }}
            className="bg-[#F3D6D6] text-primary-900 h-screen sticky top-0 flex flex-col shadow-xl border-r border-[#C62828]/20"
        >
            {/* Logo & Toggle */}
            <div className="p-3 flex items-center justify-between border-b border-primary-100">
                {!collapsed && (
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-[#C62828] rounded-lg flex items-center justify-center">
                            <Home className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <h2 className="font-bold text-lg text-primary-900">AI Homes</h2>
                            <p className="text-xs text-primary-600">{dashboardTitle}</p>
                        </div>
                    </Link>
                )}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="p-2 hover:bg-primary-50 rounded-lg transition-colors text-primary-600"
                >
                    {collapsed ? (
                        <ChevronRight className="h-5 w-5" />
                    ) : (
                        <ChevronLeft className="h-5 w-5" />
                    )}
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive
                                ? 'bg-primary-600 text-white shadow-md shadow-primary-200'
                                : 'text-primary-700 hover:bg-primary-50 hover:text-primary-900'
                                }`}
                        >
                            <Icon className={`h-5 w-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-primary-500'}`} />
                            {!collapsed && (
                                <span className="font-medium">{item.label}</span>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* User Profile & Logout */}
            <div className="p-3 border-t border-primary-100">
                {!collapsed ? (
                    <div className="mb-3">
                        <div className="flex items-center gap-3 p-3 bg-primary-50 rounded-lg border border-primary-100">
                            <div className="w-10 h-10 bg-white border-2 border-primary-200 rounded-full flex items-center justify-center font-bold text-primary-700">
                                {user?.name?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm truncate text-primary-900">{user?.name || 'User'}</p>
                                <p className="text-xs text-primary-600 truncate">{user?.email || 'user@example.com'}</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="mb-3 flex justify-center">
                        <div className="w-10 h-10 bg-white border-2 border-primary-200 rounded-full flex items-center justify-center font-bold text-primary-700">
                            {user?.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                    </div>
                )}

                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-primary-700 hover:bg-[#C62828] hover:text-white transition-all border border-transparent hover:border-[#C62828]"
                >
                    <LogOut className="h-5 w-5 flex-shrink-0" />
                    {!collapsed && <span className="font-medium">Logout</span>}
                </button>
            </div>
        </motion.aside>
    );
}
