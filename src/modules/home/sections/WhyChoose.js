// Section component rendering the four core selling highlights of Okomoto
export default function WhyChoose() {
  const features = [
    { icon: "🚢", title: "Global Shipping", desc: "Worldwide delivery via RO-RO or Container shipping in 30-45 days." },
    { icon: "🔍", title: "Verified Condition", desc: "Every car undergoes a mandatory 150-point inspection before listing." },
    { icon: "📜", title: "Full Documentation", desc: "We handle all export/import paperwork, customs, and registration docs." },
    { icon: "💳", title: "Secure Payments", desc: "Transfer via local bank or secure escrow. Your money is safe with us." },
  ];

  return (
    <section className="ok-why bg-white py-5 px-3">
      <div className="container" style={{ maxWidth: "72rem" }}>

        <div className="text-center mx-auto mb-5" style={{ maxWidth: "48rem" }}>
          <h2 className="fw-bold mb-3" style={{ fontSize: "clamp(1.75rem, 3vw, 2.25rem)", color: "#111827" }}>
            Why Buy from Okomoto?
          </h2>
          <p className="text-secondary fs-5 lh-lg">
            We&apos;ve revolutionized the car export industry with transparency, safety, and speed.
          </p>
        </div>

        <div className="row g-5">
          {features.map((f, i) => (
            <div key={i} className="col-12 col-md-6 col-lg-3">
              <div className="d-flex flex-column align-items-center align-items-md-start text-center text-md-start">
                <div className="ok-feature-icon">
                  {f.icon}
                </div>
                <h3 className="fw-bold mb-2" style={{ fontSize: "1.125rem", color: "#111827" }}>{f.title}</h3>
                <p className="text-secondary small lh-lg mb-0">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
