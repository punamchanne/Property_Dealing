'use client';

import { useState, useEffect } from 'react';
import { meetingsAPI } from '@/lib/api';
import { Meeting } from '@/types';
import { Loader2, Calendar, Clock, Video, MapPin, User as UserIcon, XCircle, CheckCircle } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function UserBookingsPage() {
    const [meetings, setMeetings] = useState<Meeting[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadMeetings();
    }, []);

    const loadMeetings = async () => {
        try {
            const response = await meetingsAPI.getAll();
            setMeetings(response.data.meetings);
        } catch (error) {
            console.error('Error loading meetings:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'scheduled': return 'bg-[#F3D6D6]/50 text-[#C62828] border-[#C62828]/20';
            case 'completed': return 'bg-green-50 text-green-700 border-green-200';
            case 'cancelled': return 'bg-red-50 text-red-700 border-red-200';
            default: return 'bg-gray-50 text-gray-600 border-gray-200';
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-[#C62828]" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Book Appointments</h1>
                    <p className="text-gray-500 mt-1">Manage your scheduled property visits and virtual meetings</p>
                </div>
            </div>

            {meetings.length > 0 ? (
                <div className="space-y-4">
                    {meetings.map((meeting, index) => (
                        <motion.div
                            key={meeting._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            className="bg-white rounded-xl border border-primary-100 p-6 shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                {/* Property Info */}
                                <div className="flex-1">
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 bg-[#F3D6D6]/30 rounded-lg">
                                            <Calendar className="h-6 w-6 text-[#C62828]" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900 mb-1">
                                                {meeting.propertyId?.title || 'Unknown Property'}
                                            </h3>
                                            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                                                <div className="flex items-center gap-1">
                                                    <Clock className="h-4 w-4" />
                                                    {formatDate(meeting.scheduledDate)}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    {meeting.type === 'virtual' ? (
                                                        <Video className="h-4 w-4" />
                                                    ) : (
                                                        <MapPin className="h-4 w-4" />
                                                    )}
                                                    <span className="capitalize">{meeting.type} Meeting</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <UserIcon className="h-4 w-4" />
                                                    Wait owner: {meeting.ownerId?.name || 'Owner'}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Status & Actions */}
                                <div className="flex flex-col sm:flex-row items-center gap-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border capitalize ${getStatusColor(meeting.status)}`}>
                                        {meeting.status}
                                    </span>

                                    {meeting.status === 'scheduled' && meeting.type === 'virtual' && meeting.meetLink && (
                                        <a href={meeting.meetLink} target="_blank" rel="noopener noreferrer">
                                            <Button className="bg-[#C62828] hover:bg-[#A81E1E] text-white">
                                                <Video className="mr-2 h-4 w-4" />
                                                Join Meeting
                                            </Button>
                                        </a>
                                    )}

                                    {meeting.status === 'scheduled' && (
                                        <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700">
                                            Cancel
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-10 bg-white rounded-xl border border-dashed border-[#C62828]/30">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#F3D6D6]/50 mb-4">
                        <Calendar className="h-8 w-8 text-[#C62828]" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">No meetings scheduled</h2>
                    <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                        Schedule a visit or virtual tour for properties you're interested in.
                    </p>
                    <Link href="/explore">
                        <Button className="bg-[#C62828] hover:bg-[#A81E1E]">
                            Find Properties
                        </Button>
                    </Link>
                </div>
            )}
        </div>
    );
}
