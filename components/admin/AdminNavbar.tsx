import { useState, useEffect } from 'react';
import { Bell, Search, Menu, X, Info } from 'lucide-react';
import { Input } from '@/components/ui/input';
import api from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

interface AdminNavbarProps {
    onMenuClick: () => void;
}

interface Activity {
    _id: string;
    action: string;
    details: string;
    createdAt: string;
    user: {
        _id: string;
        name: string;
        email: string;
        avatar: string;
    };
}

export default function AdminNavbar({ onMenuClick }: AdminNavbarProps) {
    const [notifications, setNotifications] = useState<Activity[]>([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    const fetchNotifications = async () => {
        try {
            const res = await api.get('/users/activity');
            if (res.data.success) {
                setNotifications(res.data.activities);
                // Simple logic: consider first 5 as "unread" for demo, or needing a real read status
                // For now, let's just show the total count of recent activities
                setUnreadCount(res.data.activities.length);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000); // Poll every 30s
        return () => clearInterval(interval);
    }, []);

    return (
        <header className="bg-[#F3D6D6] border-b border-[#C62828]/20 sticky top-0 z-30">
            <div className="px-6 py-4 flex items-center justify-between">
                {/* Left: Mobile Menu + Search */}
                <div className="flex items-center gap-4 flex-1">
                    <button
                        onClick={onMenuClick}
                        className="lg:hidden p-2 hover:bg-primary-50 rounded-lg transition-colors"
                    >
                        <Menu className="h-6 w-6 text-primary-600" />
                    </button>

                    <div className="relative max-w-md w-full hidden md:block">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary-400" />
                        <Input
                            type="search"
                            placeholder="Search properties, users..."
                            className="pl-10 bg-primary-50 border-primary-100 placeholder:text-primary-300 focus:border-primary-500 rounded-xl"
                        />
                    </div>
                </div>

                {/* Right: Notifications */}
                <div className="relative">
                    <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className="relative p-2 hover:bg-primary-50 rounded-lg transition-colors"
                    >
                        <Bell className="h-6 w-6 text-primary-600" />
                        {unreadCount > 0 && (
                            <span className="absolute top-1 right-1 w-2 h-2 bg-[#C62828] rounded-full animate-pulse"></span>
                        )}
                    </button>

                    <AnimatePresence>
                        {showNotifications && (
                            <>
                                <div
                                    className="fixed inset-0 z-40"
                                    onClick={() => setShowNotifications(false)}
                                ></div>
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-primary-100 z-50 overflow-hidden"
                                >
                                    <div className="p-4 border-b border-primary-100 flex justify-between items-center bg-primary-50/50">
                                        <h3 className="font-bold text-primary-900">Notifications</h3>
                                        <button onClick={() => setShowNotifications(false)}>
                                            <X className="h-4 w-4 text-primary-500 hover:text-primary-700" />
                                        </button>
                                    </div>
                                    <div className="max-h-96 overflow-y-auto">
                                        {notifications.length === 0 ? (
                                            <div className="p-8 text-center text-primary-400">
                                                <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                                <p className="text-sm">No new notifications</p>
                                            </div>
                                        ) : (
                                            <div className="divide-y divide-primary-50">
                                                {notifications.map((notif) => (
                                                    <div key={notif._id} className="p-4 hover:bg-primary-50 transition-colors">
                                                        <div className="flex gap-3">
                                                            <div className="mt-1">
                                                                <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                                                                    <Info className="h-4 w-4" />
                                                                </div>
                                                            </div>
                                                            <div className="flex-1">
                                                                <p className="text-sm text-primary-900 font-medium">{notif.details}</p>
                                                                <p className="text-xs text-primary-500 mt-1">
                                                                    {notif.user?.name} • {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-3 border-t border-primary-100 bg-primary-50/30 text-center">
                                        <Link href="/admin/users" className="text-xs font-bold text-primary-700 hover:text-primary-900">
                                            View All Activity
                                        </Link>
                                    </div>
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </header>
    );
}
