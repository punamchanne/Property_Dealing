'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, User, Shield, Ban, Eye, MoreVertical } from 'lucide-react';
import api from '@/lib/api';
import { format } from 'date-fns';
import Link from 'next/link';
import { toast } from 'sonner';

interface UserData {
    _id: string;
    name: string;
    email: string;
    role: string;
    isBlocked: boolean;
    lastLogin?: string;
    createdAt: string;
}

export default function AdminUsersPage() {
    const [users, setUsers] = useState<UserData[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchUsers = async () => {
        try {
            const res = await api.get(`/users?search=${searchTerm}`);
            if (res.data.success) {
                setUsers(res.data.users);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            toast.error('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            fetchUsers();
        }, 500);

        return () => clearTimeout(delayDebounce);
    }, [searchTerm]);

    const handleBlockToggle = async (userId: string, currentStatus: boolean) => {
        try {
            const endpoint = `/users/${userId}/${currentStatus ? 'unblock' : 'block'}`;
            await api.put(endpoint);
            toast.success(`User ${currentStatus ? 'unblocked' : 'blocked'} successfully`);
            fetchUsers(); // Refresh list
        } catch (error) {
            toast.error('Action failed');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-primary-900">User Management</h1>
                    <p className="text-primary-600">View and manage all registered users.</p>
                </div>
            </div>

            {/* Search */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-primary-100">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary-400" />
                    <Input
                        placeholder="Search by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 h-11 bg-primary-50/50 border-primary-200 rounded-lg focus:ring-primary-500"
                    />
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-xl shadow-sm border border-primary-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-primary-50 border-b border-primary-100 text-primary-700 font-semibold text-sm uppercase tracking-wider">
                                <th className="p-4">User</th>
                                <th className="p-4">Role</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Last Login</th>
                                <th className="p-4">Joined</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-primary-50">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-primary-500">Loading users...</td>
                                </tr>
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-primary-500">No users found.</td>
                                </tr>
                            ) : (
                                users.map((user) => (
                                    <tr key={user._id} className="hover:bg-primary-50/50 transition-colors group">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-primary-900">{user.name}</p>
                                                    <p className="text-sm text-primary-500">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${user.role === 'admin'
                                                ? 'bg-purple-100 text-purple-700 border-purple-200'
                                                : user.role === 'owner'
                                                    ? 'bg-blue-100 text-blue-700 border-blue-200'
                                                    : 'bg-green-100 text-green-700 border-green-200'
                                                }`}>
                                                {user.role.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            {user.isBlocked ? (
                                                <span className="flex items-center gap-1 text-red-600 font-medium text-sm">
                                                    <Ban className="h-4 w-4" /> Blocked
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1 text-green-600 font-medium text-sm">
                                                    <Shield className="h-4 w-4" /> Active
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-4 text-sm text-primary-600">
                                            {user.lastLogin ? format(new Date(user.lastLogin), 'MMM d, h:mm a') : 'Never'}
                                        </td>
                                        <td className="p-4 text-sm text-primary-600">
                                            {format(new Date(user.createdAt), 'MMM d, yyyy')}
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link href={`/admin/users/${user._id}`}>
                                                    <Button variant="outline" size="sm" className="h-8 w-8 p-0 rounded-lg border-primary-200 text-primary-600 hover:text-primary-900 hover:bg-primary-50">
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className={`h-8 w-8 p-0 rounded-lg border-primary-200 hover:bg-red-50 ${user.isBlocked ? 'text-green-600 hover:text-green-700' : 'text-red-600 hover:text-red-700'}`}
                                                    onClick={() => handleBlockToggle(user._id, user.isBlocked)}
                                                    title={user.isBlocked ? "Unblock User" : "Block User"}
                                                >
                                                    {user.isBlocked ? <Shield className="h-4 w-4" /> : <Ban className="h-4 w-4" />}
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
