import Link from "next/link";
import Image from "next/image";
import logoImg from "@/assets/images/logonav.svg";
import { MessageSquare, Sparkles } from "lucide-react";

// Component rendering the footer layout with navigation links and WhatsApp chat option
export default function Footer() {
  return (
   <footer className="ok-home-footer">
        <div className="container-xxl">
          <div className="ok-home-footer__grid">
            <div className="ok-home-footer__brand">
              <Image
                src={logoImg}
                alt="Okomoto"
                height={42}
                style={{ width: "auto" }}
              />
              <p>
                Exporting verified cars from USA to Nigeria with transparent
                pricing and reliable shipping. The High-Velocity Curator for
                Nigerian roads.
              </p>
            </div>

            <div className="ok-home-footer__col">
              <h3>About</h3>
              <Link href="/about">About us</Link>
              <Link href="/how-it-works">How it Works</Link>
              {/* <Link href="/shipping-logistics">Shipping &amp; Logistics</Link>
              <Link href="/blog">Blog</Link> */}
            </div>

            <div className="ok-home-footer__col">
              <h3>Support</h3>
              <Link href="/contact-us">Contact Us</Link>
            </div>

            <div className="ok-home-footer__col">
              <h3>Legal</h3>
              <Link href="/privacy-policy">Privacy Policy</Link>
              <Link href="/terms-of-service">Terms of Service</Link>
            </div>

            <div className="ok-home-footer__whatsapp">
              <div className="whatsapp-badge">
                {/* Left Icon */}
                <div className="whatsapp-icon">
                  <MessageSquare size={20} />
                </div>

                {/* Right Content */}
                <div className="whatsapp-content">
                  <h3>Chat with us on WhatsApp</h3>

                  <p>
                    Quick support and inquiries.
                  </p>
                </div>
              </div>


              <a
                href="https://wa.me/1234567890"
                target="_blank"
                rel="noreferrer"
                className="whatsapp-btn"
              >
                Start Chat
              </a>
            </div>
          </div>
        </div>
      </footer>
  );
}