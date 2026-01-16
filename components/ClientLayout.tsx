'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';
import CompareFloatingBar from './CompareFloatingBar';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    // Don't show public navbar on auth, admin, or dashboard pages (they have their own navigation)
    const isAuthPage = pathname?.startsWith('/auth');
    const isAdminPage = pathname?.startsWith('/admin');
    const isDashboardPage = pathname?.startsWith('/dashboard');

    const shouldHideNavbar = isAuthPage || isAdminPage || isDashboardPage;
    const shouldHideFooter = isAuthPage; // Only hide footer on auth pages

    return (
        <>
            {!shouldHideNavbar && <Navbar />}
            <main className={!shouldHideNavbar ? 'min-h-screen' : ''}>
                {children}
            </main>
            {!shouldHideFooter && <Footer />}
            {!shouldHideNavbar && <CompareFloatingBar />}
        </>
    );
}
