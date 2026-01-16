'use client';

import { Bell, Search, Menu } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface DashboardNavbarProps {
    onMenuClick: () => void;
    title?: string;
}

export default function DashboardNavbar({ onMenuClick, title = 'Dashboard' }: DashboardNavbarProps) {
    return (
        <header className="bg-[#F3D6D6] border-b border-[#C62828]/20 sticky top-0 z-10">
            <div className="px-6 py-4 flex items-center justify-between">
                {/* Left: Mobile Menu + Title */}
                <div className="flex items-center gap-4 flex-1">
                    <button
                        onClick={onMenuClick}
                        className="lg:hidden p-2 hover:bg-primary-50 rounded-lg transition-colors"
                    >
                        <Menu className="h-6 w-6 text-primary-600" />
                    </button>

                    <h1 className="text-2xl font-bold text-primary-900">{title}</h1>
                </div>

                {/* Right: Search + Notifications */}
                <div className="flex items-center gap-4">
                    <div className="relative hidden md:block">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary-400" />
                        <Input
                            type="search"
                            placeholder="Search..."
                            className="pl-10 w-64 bg-primary-50 border-primary-100 placeholder:text-primary-300 focus:border-primary-500"
                        />
                    </div>

                    <button className="relative p-2 hover:bg-primary-50 rounded-lg transition-colors">
                        <Bell className="h-6 w-6 text-primary-600" />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-[#C62828] rounded-full"></span>
                    </button>
                </div>
            </div>
        </header>
    );
}
