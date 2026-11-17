"use client";

import ContactSection from "@/modules/contact-us/sections/ContactSection";

// Page component rendering the public contact page with submission forms
export default function ContactPage() {
    return (
        <main className="contact-page-wrapper ok-contact-page" style={{ minHeight: "100vh" }}>
            <ContactSection />
        </main>
    );
}
