'use client';

import { useCompare } from '@/contexts/CompareContext';
import { motion, AnimatePresence } from 'framer-motion';
import { GitCompare, X } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function CompareFloatingBar() {
    const { compareList, removeFromCompare, clearCompare, compareCount } = useCompare();

    if (compareCount === 0) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
            >
                <div className="bg-gradient-to-r from-primary-700 to-primary-900 text-white rounded-full shadow-2xl px-6 py-4 flex items-center gap-4">
                    <GitCompare className="h-6 w-6" />

                    <div className="flex items-center gap-2">
                        <span className="font-semibold">{compareCount} Properties Selected</span>
                        <div className="flex gap-1">
                            {compareList.map((id) => (
                                <button
                                    key={id}
                                    onClick={() => removeFromCompare(id)}
                                    className="p-1 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                                    title="Remove"
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-2 border-l border-white/30 pl-4">
                        <Link href="/compare">
                            <Button
                                size="sm"
                                className="bg-white text-primary-700 hover:bg-white/90 font-semibold"
                            >
                                Compare Now
                            </Button>
                        </Link>
                        <button
                            onClick={clearCompare}
                            className="text-white/80 hover:text-white text-sm font-medium transition-colors"
                        >
                            Clear All
                        </button>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
