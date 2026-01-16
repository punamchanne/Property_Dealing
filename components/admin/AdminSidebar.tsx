'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import {
    LayoutDashboard,
    Users,
    Building2,
    Settings,
    LogOut,
    ChevronLeft,
    ChevronRight,
    Home,
    LucideIcon,
    BarChart3,
    Calendar, // Keep Calendar as it was in the original imports, even if not used in new menuItems
} from 'lucide-react';

interface MenuItem {
    icon: LucideIcon;
    label: string;
    href: string;
}

interface AdminSidebarProps {
    collapsed?: boolean;
    setCollapsed?: (value: boolean) => void;
}

const adminMenuItems: MenuItem[] = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
    { icon: Users, label: 'Users', href: '/admin/users' },
    { icon: Building2, label: 'Properties', href: '/admin/properties' },
    { icon: BarChart3, label: 'Analytics', href: '/admin/analytics' },
    { icon: Settings, label: 'Settings', href: '/admin/settings' },
];

export default function AdminSidebar({ collapsed: controlledCollapsed, setCollapsed: controlledSetCollapsed }: AdminSidebarProps = {}) {
    const [internalCollapsed, setInternalCollapsed] = useState(false);

    // Use controlled state if provided, otherwise use internal state
    const collapsed = controlledCollapsed !== undefined ? controlledCollapsed : internalCollapsed;
    const setCollapsed = controlledSetCollapsed || setInternalCollapsed;
    const pathname = usePathname();
    const router = useRouter();
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        router.push('/');
    };

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
                            <p className="text-xs text-primary-600">Admin Panel</p>
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
                {adminMenuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive
                                ? 'bg-[#C62828] text-white shadow-md shadow-[#C62828]/30'
                                : 'text-primary-700 hover:bg-white/50 hover:text-primary-900'
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
                                {user?.name?.charAt(0).toUpperCase() || 'A'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm truncate text-primary-900">{user?.name || 'Admin User'}</p>
                                <p className="text-xs text-primary-600 truncate">{user?.email || 'admin@aihomes.com'}</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="mb-3 flex justify-center">
                        <div className="w-10 h-10 bg-white border-2 border-primary-200 rounded-full flex items-center justify-center font-bold text-primary-700">
                            {user?.name?.charAt(0).toUpperCase() || 'A'}
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
