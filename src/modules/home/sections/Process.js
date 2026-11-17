// Section component rendering the four-step car export overview cards
export default function Process() {
    const steps = [
        { num: "01", title: "Choose Your Car", desc: "Browse our extensive inventory of verified vehicles from Japan, Korea, and UAE." },
        { num: "02", title: "Get a Quote", desc: "Receive a total price including FOB, shipping (RO-RO/Container), and insurance." },
        { num: "03", title: "Secure Payment", desc: "Make a deposit to reserve your vehicle. We handle all local logistics and inspections." },
        { num: "04", title: "Shipping & Delivery", desc: "Your car is loaded and shipped. Track your shipment until it reaches your port." },
    ];

    return (
        <section className="ok-process py-5 px-3">
            <div className="container-xxl">

                <div className="d-flex flex-column flex-md-row align-items-center justify-content-between mb-5 gap-4">
                    <div style={{ maxWidth: "36rem" }}>
                        <h2 className="fw-black text-white mb-3" style={{ fontSize: "clamp(1.875rem, 4vw, 3rem)", letterSpacing: "-0.02em" }}>
                            A SEAMLESS<br />
                            <span style={{ color: "#3b82f6" }}>EXPORT JOURNEY.</span>
                        </h2>
                        <p className="text-secondary fs-6 lh-lg">
                            We&apos;ve simplified the complex world of international vehicle trade into four easy steps.
                        </p>
                    </div>
                    <button
                        className="btn btn-light fw-black px-4 py-3 rounded-pill text-uppercase"
                        style={{ fontSize: "0.75rem", letterSpacing: "0.12em" }}
                    >
                        See Detailed Guide
                    </button>
                </div>

                <div className="position-relative">
                    {/* Connector line (desktop only) */}
                    <div className="ok-connector"></div>

                    <div className="row g-4">
                        {steps.map((s, i) => (
                            <div key={i} className="col-12 col-md-6 col-lg-3">
                                <div className="ok-process-card h-100">
                                    <span className="ok-process-num-bg">{s.num}</span>
                                    <div className="ok-process-icon">{s.num}</div>
                                    <h3 className="fw-bold text-white mb-3" style={{ fontSize: "1.125rem" }}>
                                        {s.title}
                                    </h3>
                                    <p className="text-secondary small lh-lg mb-0">{s.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
}
