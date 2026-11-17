"use client";

import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FCMHandler from "@/components/layout/FCMHandler";
import { AuthProvider } from "@/context/AuthContext";
import { Provider, useSelector } from "react-redux";
import { store } from "@/store/store";
import { usePathname } from "next/navigation";
import { GoogleOAuthProvider } from "@react-oauth/google";

// Helper component to conditionally render Footer based on route and auth state
function FooterWrapper() {
    const { token } = useSelector((state) => state.auth);
    const pathname = usePathname();
    const [isClient, setIsClient] = React.useState(false);
    const [hasToken, setHasToken] = React.useState(false);

    React.useEffect(() => {
        setIsClient(true);
        setHasToken(!!localStorage.getItem("token") || !!token);
    }, [token]);

    const isHomePage = pathname === "/";
    const isAuthPage = pathname.startsWith("/login") ||
        pathname.startsWith("/signup") ||
        pathname.startsWith("/verify-email") ||
        pathname.startsWith("/forgot-password") ||
        pathname.startsWith("/reset-password");

    const isDashboardPage = pathname.startsWith("/dashboard") ||
        pathname.startsWith("/cars") ||
        pathname.startsWith("/saved") ||
        pathname.startsWith("/better-deal");

    const hideFooter = isHomePage || isAuthPage || isDashboardPage || (isClient && hasToken);

    if (hideFooter) return null;
    return <Footer />;
}

// Global wrapper layout component that configures Redux, Google OAuth, and AuthProvider
export default function ClientLayout({ children }) {
    const pathname = usePathname();
    const isAuthPage = pathname.startsWith("/login") ||
        pathname.startsWith("/signup") ||
        pathname.startsWith("/verify-email") ||
        pathname.startsWith("/forgot-password") ||
        pathname.startsWith("/reset-password");

    return (
        <Provider store={store}>
            <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}>
                <AuthProvider>
                    <FCMHandler />
                    {!isAuthPage && <Navbar />}
                    <main id="main-content">
                        {children}
                    </main>
                    <FooterWrapper />
                </AuthProvider>
            </GoogleOAuthProvider>
        </Provider>
    );
}
