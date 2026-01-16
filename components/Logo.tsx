import Link from 'next/link';
import Image from 'next/image';

export default function Logo() {
    return (
        <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-12 h-12 flex-shrink-0 bg-gradient-to-br from-primary-700 to-primary-900 rounded-lg p-2 shadow-md">
                <div className="relative w-full h-full bg-white rounded-sm p-0.5">
                    <Image
                        src="/logo.png"
                        alt="AI Homes"
                        fill
                        className="object-contain"
                        priority
                    />
                </div>
            </div>
            <div className="flex flex-col">
                <span className="text-xl font-bold text-gray-900 group-hover:text-primary-700 transition-all">
                    AI Homes
                </span>
                <span className="text-xs text-gray-600 -mt-1">Real Estate</span>
            </div>
        </Link>
    );
}
