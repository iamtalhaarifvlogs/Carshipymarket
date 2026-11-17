import Image from "next/image";
import logoImg from "@/assets/images/logo.svg";

// Component rendering a trust footer row showing secure payments, verified listings, and pricing policies
export default function TrustBar() {
    const items = [
        {
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            ),
            iconBg: "#EFF6FF",
            title: "Secure Payments",
            subtitle: "Bank-level encryption",
        },
        {
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.709 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02108 11.3363C2.16237 9.18455 2.99447 7.13631 4.39452 5.49706C5.79457 3.85781 7.69055 2.71537 9.79471 2.24021C11.8989 1.76505 14.1009 1.98234 16.07 2.85999" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M22 4L12 14.01L9 11.01" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            ),
            iconBg: "#F0FDF4",
            title: "Verified Listings",
            subtitle: "100% inspected vehicles",
        },
        {
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20.59 13.41L13.41 20.59C13.2243 20.776 13.0037 20.9235 12.761 21.0241C12.5183 21.1248 12.2581 21.1766 11.9954 21.1766C11.7327 21.1766 11.4725 21.1248 11.2298 21.0241C10.9871 20.9235 10.7665 20.776 10.5808 20.59L3.40078 13.41C2.50078 12.51 2.00078 11.3 2.00078 10V4C2.00078 2.9 2.90078 2 4.00078 2H10C11.3 2 12.51 2.5 13.41 3.4L20.59 10.58C21.5 11.48 21.5 12.5 20.59 13.41Z" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M7 7H7.01" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            ),
            iconBg: "#FAF5FF",
            title: "Transparent Pricing",
            subtitle: "No hidden fees",
        },
    ];

    return (
        <section className="ok-trustbar">
            <div className="container-xxl">
                <div className="d-flex flex-column flex-md-row align-items-center justify-content-between">

                    {/* Logo */}
                    <div className="d-flex align-items-center mb-4 mb-md-0">
                        <Image src={logoImg} alt="Okomoto Logo" height={42} style={{ width: "auto" }} />
                    </div>

                    {/* Trust Items Container */}
                    <div className="ok-trust-items-row d-flex flex-wrap flex-column flex-md-row justify-content-center align-items-center gap-0 w-100 ps-md-5">
                        {items.map((item, idx) => (
                            <div key={idx} className="d-flex align-items-center w-100-mobile h-100 flex-grow-1">
                                <div className="ok-trust-item d-flex align-items-center gap-3 px-md-4 py-2 py-md-0 w-100 justify-content-md-center justify-content-start">
                                    <div className="ok-trust-icon-wrap" style={{ backgroundColor: item.iconBg }}>
                                        {item.icon}
                                    </div>
                                    <div>
                                        <h4 className="fs-18 fw-600 black mb-0">{item.title}</h4>
                                        <p className="mb-0 fs-14" style={{ color: "#4A5565" }}>{item.subtitle}</p>
                                    </div>
                                </div>
                                {idx < items.length - 1 && <div className="ok-trust-separator d-none d-md-block" />}
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </section>
    );
}
