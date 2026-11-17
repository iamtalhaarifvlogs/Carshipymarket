"use client";

import Link from "next/link";
import {
  ArrowRight,
  ClipboardList,
  CreditCard,
  MessageCircleMore,
  Search,
  ShieldCheck,
  Truck,
} from "lucide-react";

import heroBg from "@/assets/images/hero-bg.png";

const steps = [
  {
    num: "01",
    title: "Search your car",
    text: "Browse the inventory by make, model, year, price, or mileage and open the car you like.",
    icon: Search,
  },
  {
    num: "02",
    title: "See the full cost",
    text: "Check the vehicle price, export estimate, and shipping option so you know the total before you move ahead.",
    icon: ClipboardList,
  },
  {
    num: "03",
    title: "Ask on WhatsApp",
    text: "Send an inquiry through WhatsApp or the form. The team replies with help and next steps.",
    icon: MessageCircleMore,
  },
  {
    num: "04",
    title: "Reserve and ship",
    text: "Pay the reservation through Escrow.com, then the car is shipped using the chosen route.",
    icon: CreditCard,
  },
];

const highlights = [
  {
    title: "Verified inventory",
    text: "Vehicle data, images, and details are kept easy to review.",
    icon: ShieldCheck,
  },
  {
    title: "Export pricing",
    text: "You can see the price with export and shipping costs.",
    icon: ClipboardList,
  },
  {
    title: "Shipping choices",
    text: "RO-RO or Container options are shown clearly.",
    icon: Truck,
  },
];

// Page component rendering the 'How It Works' guide describing vehicle search, pricing, and shipping steps
export default function HowItWorksPage() {
  return (
    <div className="ok-home-page ok-hiw-page">
      <section className="ok-home-hero ok-hiw-hero">
        <div
          className="ok-home-hero__bg"
          style={{ backgroundImage: `url(${heroBg.src})` }}
        />
        <div className="ok-home-hero__scrim ok-hiw-hero__scrim" />

        <div className="container-xxl ok-home-hero__inner ok-hiw-hero__inner">
          <div className="row align-items-center g-4 g-lg-5">
            <div className="col-12 col-lg-7">
              <div className="ok-home-hero__copy ok-hiw-hero__copy">
                <div className="ok-home-kicker">HOW IT WORKS</div>
                <h1>
                  <span className="ok-home-hero__line">Simple steps.</span>
                  <span className="ok-home-hero__line1">
                    Easy export journey.
                  </span>
                </h1>
                <p className="ok-home-subcopy">
                  We keep the buying process easy to follow so you can go from
                  browsing a car to confirming shipment without confusion.
                </p>

                <div className="ok-home-hero__actions">
                  <Link href="/" className="ok-home-btn ok-home-btn--primary">
                    Browse Cars
                  </Link>
                  <Link
                    href="/shipping-quote"
                    className="ok-home-btn ok-home-btn--secondary"
                  >
                    Get Shipping Quote
                  </Link>
                </div>
              </div>
            </div>

            <div className="col-12 col-lg-5">
              <div className="ok-hiw-hero__panel">
                <div className="ok-hiw-hero__panel-head">
                  <p className="ok-hiw-section__eyebrow mb-2">At a glance</p>
                  <h2 className="ok-hiw-hero__panel-title">
                    What the page shows you
                  </h2>
                  <p className="ok-hiw-hero__panel-sub">
                    Price, shipping, inquiry, and reservation are shown in a
                    simple order so the next step is always clear.
                  </p>
                </div>

                <div className="ok-hiw-mini-list">
                  {highlights.map((item, index) => {
                    const Icon = item.icon;

                    return (
                      <div key={item.title} className="ok-hiw-mini-step">
                        <div className="ok-hiw-mini-step__num">
                          0{index + 1}
                        </div>
                        <div className="ok-hiw-mini-step__content">
                          <h3>{item.title}</h3>
                          <p>{item.text}</p>
                        </div>
                        <div className="ok-hiw-mini-step__icon">
                          <Icon size={18} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="ok-hiw-section">
        <div className="container-xxl">
          <div className="ok-home-section__head ok-home-section__head--dark">
            <div>
              <p className="ok-home-section__eyebrow">THE PROCESS</p>
              <h2>Four easy steps</h2>
              <p className="ok-home-section__lead ok-hiw-section__lead">
                Everything is arranged in the same order the customer will use
                it.
              </p>
            </div>
          </div>

          <div className="ok-hiw-step-grid">
            {steps.map((step) => {
              const Icon = step.icon;

              return (
                <article key={step.num} className="ok-hiw-step-card">
                  {/* <div className="ok-hiw-step-card__icon">
                    <Icon size={20} />
                  </div> */}
                  <div className="ok-hiw-step-card__top">
                    {/* <Icon size={20} /> */}
                    <div className="ok-hiw-step-card__num">{step.num}</div>
                    <ArrowRight size={18} />
                  </div>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                  <div className="ok-hiw-step-card__footer">
                    <span>Easy to follow</span>
                    <span>Mobile friendly</span>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="ok-hiw-info">
        <div className="container-xxl">
          <div className="ok-home-section__head ok-home-section__head--dark">
            <div>
              <p className="ok-home-section__eyebrow">WHY IT FEELS CLEAR</p>
              <h2>What helps the user understand the flow</h2>
              <p className="ok-home-section__lead ok-hiw-section__lead">
                The page keeps the same dark visual theme as the home page and
                uses short, plain language.
              </p>
            </div>
          </div>

          <div className="ok-hiw-info-grid">
            {[
              "Search and filter cars quickly",
              "See price, shipping, and destination together",
              "Use WhatsApp for fast help",
            ].map((item) => (
              <div key={item} className="ok-hiw-info-card">
                <div className="ok-hiw-info-card__icon">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <h3>{item}</h3>
                  <p>
                    The layout is kept short and readable so the next action is
                    obvious on both desktop and phone.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="ok-hiw-cta">
        <div className="container-xxl">
          <div className="ok-hiw-cta__wrap">
            <div className="row align-items-center g-4">
              <div className="col-12 col-lg-8">
                <div className="ok-home-kicker mb-3">READY TO START?</div>
                <h2 className="ok-hiw-cta__title">
                  Browse a car, check the cost, and ask us on WhatsApp.
                </h2>
                <p className="ok-hiw-cta__text">
                  The process stays simple from start to finish, so customers
                  can understand how the export journey works without extra
                  clutter.
                </p>
              </div>
              <div className="col-12 col-lg-4">
                <div className="ok-hiw-cta__actions">
                  <Link
                    href="/shipping-quote"
                    className="ok-home-btn ok-home-btn--primary ok-hiw-cta__btn"
                  >
                    Request Quote
                    <ArrowRight size={16} />
                  </Link>
                  <Link
                    href="/"
                    className="ok-home-btn ok-home-btn--ghost ok-hiw-cta__btn"
                  >
                    Back to Home
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
