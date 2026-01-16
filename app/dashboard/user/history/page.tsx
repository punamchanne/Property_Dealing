'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Eye, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export default function RecentlyViewedPage() {
    // In a real app, this would come from a Context or API
    // For now, we mock it or show an empty state to demonstrate the UI
    const [history, setHistory] = useState<any[]>([]);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Recently Viewed</h1>
                    <p className="text-gray-500 mt-1">Properties you've checked out lately</p>
                </div>
            </div>

            {history.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {/* Map history items here */}
                </div>
            ) : (
                <div className="text-center py-10 bg-white rounded-xl border border-dashed border-[#C62828]/30">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#F3D6D6]/50 mb-4">
                        <Eye className="h-8 w-8 text-[#C62828]" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">No viewing history</h2>
                    <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                        Your browsing history is empty. Start exploring to see properties here.
                    </p>
                    <Link href="/explore">
                        <Button className="bg-[#C62828] hover:bg-[#A81E1E]">
                            <Search className="mr-2 h-4 w-4" />
                            Start Exploring
                        </Button>
                    </Link>
                </div>
            )}
        </div>
    );
}
