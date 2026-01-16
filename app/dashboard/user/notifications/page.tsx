'use client';

import { useState } from 'react';
import { Bell, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotificationsPage() {
    // Mock notifications for UI demonstration
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            title: 'Welcome to AI Homes',
            message: 'Thanks for joining our platform. Start your journey now!',
            date: 'Just now',
            read: false,
        },
    ]);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
                    <p className="text-gray-500 mt-1">Stay updated with important alerts</p>
                </div>
                <Button variant="outline" className="border-[#C62828] text-[#C62828] hover:bg-[#F3D6D6]/20">
                    Mark all as read
                </Button>
            </div>

            <div className="space-y-4">
                {notifications.length > 0 ? (
                    notifications.map((notification) => (
                        <div
                            key={notification.id}
                            className={`p-4 rounded-xl border ${notification.read ? 'bg-white border-gray-100' : 'bg-[#F3D6D6]/20 border-[#C62828]/20'
                                } flex items-start gap-4 transition-all`}
                        >
                            <div className={`p-2 rounded-full ${notification.read ? 'bg-gray-100 text-gray-500' : 'bg-[#C62828]/10 text-[#C62828]'}`}>
                                <Bell className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                                <h3 className={`font-semibold ${notification.read ? 'text-gray-700' : 'text-gray-900'}`}>
                                    {notification.title}
                                </h3>
                                <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                                <span className="text-xs text-gray-400 mt-2 block">{notification.date}</span>
                            </div>
                            {!notification.read && (
                                <div className="w-2 h-2 rounded-full bg-[#C62828] mt-2"></div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="text-center py-10 bg-white rounded-xl">
                        <p className="text-gray-500">No new notifications</p>
                    </div>
                )}
            </div>
        </div>
    );
}
