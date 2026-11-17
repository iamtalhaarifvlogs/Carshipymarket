"use client";

import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { createInquiry } from "@/services/vehicle.service";
import {
  Mail,
  MapPin,
  MessageCircleMore,
  Phone,
  Send,
  Clock3,
  Loader2,
  CheckCircle2,
  RotateCcw,
} from "lucide-react";

const contactCards = [
  {
    title: "WhatsApp Support",
    value: "+971 4 555 0192",
    text: "Quick help for car, shipping, and reservation questions.",
    icon: MessageCircleMore,
  },
  {
    title: "Email Support",
    value: "support@okomotors.com",
    text: "Send your inquiry and we will reply with the next step.",
    icon: Mail,
  },
  {
    title: "Office Location",
    value: "Dubai Design District, UAE",
    text: "Visit or contact our team for export assistance.",
    icon: MapPin,
  },
];

const quickPoints = [
  "Vehicle inquiry",
  "Shipping estimate",
  "Escrow reservation",
  "Export guidance",
];

// Helper to retrieve user's local timezone dynamically
const getUserTimezone = () => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "Africa/Lagos";
  } catch (e) {
    return "Africa/Lagos";
  }
};

// Helper to determine leadSource (mobile vs web)
const getLeadSource = () => {
  if (typeof window === "undefined") return "web";
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  if (/android|ipad|playbook|silk|iphone|ipod/i.test(userAgent) || window.innerWidth <= 768) {
    return "mobile";
  }
  return "web";
};

// Component rendering the contact page banner, support card directories, and contact forms
export default function ContactSection() {
  const currentUser = useSelector((state) => state.auth?.user);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    countryCode: "+234",
    whatsappNumber: "",
    customerMessage: "",
  });

  const [phoneVal, setPhoneVal] = useState("");
  const [whatsappVal, setWhatsappVal] = useState("");
  const [sameAsPhone, setSameAsPhone] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedInfo, setSubmittedInfo] = useState(null);

  // Autofill logged-in user profile details if available
  useEffect(() => {
    if (currentUser) {
      const userFullName = currentUser.fullName || currentUser.name || "";
      const userEmail = currentUser.email || "";
      const userCountryCode = currentUser.countryCode || currentUser.phone_code
        ? `+${String(currentUser.countryCode || currentUser.phone_code).replace(/^\+/, "")}`
        : "+234";
      const userPhoneNum = currentUser.phoneNumber || currentUser.phone_number || "";
      const userWhatsapp = currentUser.whatsappNumber || currentUser.whatsapp_number || "";

      setFormData((prev) => ({
        ...prev,
        fullName: prev.fullName || userFullName,
        email: prev.email || userEmail,
        countryCode: prev.countryCode || userCountryCode,
        phoneNumber: prev.phoneNumber || userPhoneNum,
        whatsappNumber: prev.whatsappNumber || userWhatsapp,
      }));

      if (userPhoneNum) {
        const fullPhone = `${userCountryCode}${userPhoneNum}`;
        setPhoneVal(fullPhone);
        if (!userWhatsapp) {
          setWhatsappVal(fullPhone);
        }
      }

      if (userWhatsapp) {
        setWhatsappVal(userWhatsapp);
        setSameAsPhone(false);
      }
    }
  }, [currentUser]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Sync country code and phone number on phone input change
  const handlePhoneChange = useCallback((value, { country }) => {
    setPhoneVal(value);
    const rawDial = country?.dialCode ? String(country.dialCode).replace(/^\+/, "") : "234";
    const dialCode = `+${rawDial}`;

    let number = value;
    const cleanVal = value.startsWith("+") ? value.slice(1) : value;
    if (cleanVal.startsWith(rawDial)) {
      number = cleanVal.slice(rawDial.length);
    }

    setFormData((prev) => {
      const updated = {
        ...prev,
        countryCode: dialCode,
        phoneNumber: number,
      };

      if (sameAsPhone) {
        const formattedWhatsapp = value.startsWith("+") ? value : (value ? `+${value}` : "");
        updated.whatsappNumber = formattedWhatsapp;
      }
      return updated;
    });

    if (sameAsPhone) {
      setWhatsappVal(value);
    }
  }, [sameAsPhone]);

  // Sync WhatsApp number when customized
  const handleWhatsappChange = useCallback((value) => {
    setWhatsappVal(value);
    const formatted = value.startsWith("+") ? value : (value ? `+${value}` : "");
    setFormData((prev) => ({
      ...prev,
      whatsappNumber: formatted,
    }));
  }, []);

  const handleSameAsPhoneToggle = (checked) => {
    setSameAsPhone(checked);
    if (checked) {
      setWhatsappVal(phoneVal);
      const formatted = phoneVal.startsWith("+") ? phoneVal : (phoneVal ? `+${phoneVal}` : "");
      setFormData((prev) => ({
        ...prev,
        whatsappNumber: formatted,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.fullName.trim()) {
      toast.error("Please enter your full name.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      toast.error("Please enter a valid email address.");
      return;
    }

    if (!formData.phoneNumber.trim()) {
      toast.error("Please enter your phone number.");
      return;
    }

    if (!formData.customerMessage.trim()) {
      toast.error("Please enter your inquiry message.");
      return;
    }

    const formattedCountryCode = formData.countryCode.startsWith("+")
      ? formData.countryCode.trim()
      : `+${formData.countryCode.trim()}`;

    const formattedWhatsapp = formData.whatsappNumber.trim()
      ? (formData.whatsappNumber.startsWith("+") ? formData.whatsappNumber.trim() : `+${formData.whatsappNumber.trim()}`)
      : `${formattedCountryCode}${formData.phoneNumber.trim()}`;

    const payload = {
      fullName: formData.fullName.trim(),
      email: formData.email.trim(),
      phoneNumber: formData.phoneNumber.trim(),
      countryCode: formattedCountryCode,
      whatsappNumber: formattedWhatsapp,
      // country: "Nigeria",
      inquiryType: "general",
      customerMessage: formData.customerMessage.trim(),
      leadSource: getLeadSource(),
      timezone: getUserTimezone(),
    };

    try {
      setIsSubmitting(true);
      const response = await createInquiry(payload);
      
      const inquiryRef = response?.data?.inquiryId || response?.data?.id || "";
      setSubmittedInfo({
        fullName: payload.fullName,
        email: payload.email,
        phone: `${payload.countryCode} ${payload.phoneNumber}`,
        whatsapp: payload.whatsappNumber,
        inquiryRef: inquiryRef,
      });

      setIsSubmitted(true);
      toast.success("Thank you! Your inquiry has been submitted successfully.");
    } catch (error) {
      console.error("Failed to submit inquiry:", error);
      const errMsg =
        error?.message ||
        error?.error ||
        error?.response?.data?.message ||
        "Failed to submit your inquiry. Please try again.";
      toast.error(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setFormData({
      fullName: currentUser?.fullName || currentUser?.name || "",
      email: currentUser?.email || "",
      phoneNumber: "",
      countryCode: "+234",
      whatsappNumber: "",
      customerMessage: "",
    });
    setPhoneVal("");
    setWhatsappVal("");
    setSameAsPhone(true);
    setIsSubmitted(false);
    setSubmittedInfo(null);
  };

  return (
    <section className="ok-home-page ok-contact-page">
      <div className="ok-contact-hero">
        <div className="container-xxl ok-contact-hero__inner">
          <div className="row align-items-center g-4 g-lg-5">
            <div className="col-12 col-lg-6">
              <div className="ok-home-kicker">CONTACT US</div>
              <h1 className="ok-contact-hero__title">
                Talk to us about your next car export.
              </h1>
              <p className="ok-contact-hero__text">
                Use WhatsApp, email, or the form below. We&apos;ll help you
                understand the vehicle, the shipping cost, and the reservation
                steps in simple language.
              </p>

              <div className="ok-contact-hero__pills">
                {quickPoints.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </div>

            <div className="col-12 col-lg-6">
              <div className="ok-contact-panel">
                <div className="ok-contact-panel__head">
                  <p className="ok-hiw-section__eyebrow mb-2">Reach out</p>
                  <h2>We&apos;ll guide you to the right next step</h2>
                  <p>
                    Send the details you already know. We&apos;ll respond with
                    vehicle, shipping, or payment guidance.
                  </p>
                </div>

                <div className="ok-contact-cards">
                  {contactCards.map((item) => {
                    const Icon = item.icon;

                    return (
                      <article key={item.title} className="ok-contact-card">
                        <div className="ok-contact-card__icon">
                          <Icon size={18} />
                        </div>
                        <div>
                          <h3>{item.title}</h3>
                          <strong>{item.value}</strong>
                          <p>{item.text}</p>
                        </div>
                      </article>
                    );
                  })}
                </div>

                <div className="ok-contact-panel__note">
                  <Clock3 size={16} />
                  <span>Typical response time: within business hours.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="ok-contact-content">
        <div className="container-xxl">
          <div className="row g-4 g-xl-5 align-items-start">
            <div className="col-12 col-lg-5">
              <div className="ok-contact-sidebar">
                <h2>What you can ask us</h2>
                <p>
                  Keep it simple. Pick the topic that matches your question and
                  send us the car or route details.
                </p>

                <div className="ok-contact-sidebar__list">
                  <div>
                    <span>01</span>
                    <p>Vehicle availability and condition</p>
                  </div>
                  <div>
                    <span>02</span>
                    <p>Export price and shipping estimate</p>
                  </div>
                  <div>
                    <span>03</span>
                    <p>Escrow reservation and next steps</p>
                  </div>
                </div>

                <div className="ok-contact-sidebar__cta">
                  <Phone size={16} />
                  <div>
                    <strong>Prefer a quick call?</strong>
                    <p>Call or WhatsApp us for faster help.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 col-lg-7">
              <div className="ok-contact-form">
                {isSubmitted && submittedInfo ? (
                  <div className="ok-contact-success text-center py-4">
                    <div className="ok-contact-success__icon-box mb-3">
                      <CheckCircle2 size={42} strokeWidth={2.4} />
                    </div>
                    <h2 className="text-white mb-2" style={{ fontSize: "1.65rem", fontWeight: 800 }}>
                      Inquiry Submitted Successfully!
                    </h2>
                    <p className="text-white-50 mb-4" style={{ maxWidth: "480px", margin: "0 auto", fontSize: "0.95rem", lineHeight: 1.6 }}>
                      Thank you, <strong className="text-white">{submittedInfo.fullName}</strong>. Our export team has received your message
                      {submittedInfo.inquiryRef && (
                        <span> (Ref: <span className="text-info" style={{ fontWeight: 700 }}>{submittedInfo.inquiryRef}</span>)</span>
                      )}
                      . We will contact you via WhatsApp or Email shortly.
                    </p>

                    <div className="ok-contact-success__card p-3 mb-4 text-start" style={{ maxWidth: "460px", margin: "0 auto 1.5rem" }}>
                      <div className="d-flex justify-content-between py-2 border-bottom border-white border-opacity-10">
                        <span className="text-white-50" style={{ fontSize: "0.85rem" }}>Name</span>
                        <span className="text-white font-medium" style={{ fontSize: "0.88rem", fontWeight: 600 }}>{submittedInfo.fullName}</span>
                      </div>
                      <div className="d-flex justify-content-between py-2 border-bottom border-white border-opacity-10">
                        <span className="text-white-50" style={{ fontSize: "0.85rem" }}>Email</span>
                        <span className="text-white font-medium" style={{ fontSize: "0.88rem", fontWeight: 600 }}>{submittedInfo.email}</span>
                      </div>
                      <div className="d-flex justify-content-between py-2 border-bottom border-white border-opacity-10">
                        <span className="text-white-50" style={{ fontSize: "0.85rem" }}>WhatsApp / Phone</span>
                        <span className="text-white font-medium" style={{ fontSize: "0.88rem", fontWeight: 600 }}>{submittedInfo.whatsapp || submittedInfo.phone}</span>
                      </div>
                      <div className="d-flex justify-content-between align-items-center py-2">
                        <span className="text-white-50" style={{ fontSize: "0.85rem" }}>Status</span>
                        <span className="badge bg-success bg-opacity-25 text-success border border-success border-opacity-50 px-2 py-1" style={{ fontSize: "0.76rem" }}>
                          Received
                        </span>
                      </div>
                    </div>

                    <div className="d-flex justify-content-center">
                      <button
                        type="button"
                        className="ok-home-btn ok-home-btn--primary"
                        onClick={handleResetForm}
                      >
                        <RotateCcw size={16} />
                        Send Another Inquiry
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="ok-contact-form__head">
                      <p className="ok-hiw-section__eyebrow mb-2">Send a message</p>
                      <h2>Tell us what you need</h2>
                      <p>
                        The more details you share, the faster we can guide you.
                      </p>
                    </div>

                    <form className="ok-contact-form__grid" onSubmit={handleSubmit}>
                      <div className="ok-contact-field">
                        <label htmlFor="inquiry-fullName">Full Name</label>
                        <input
                          id="inquiry-fullName"
                          type="text"
                          placeholder="e.g. John Doe"
                          value={formData.fullName}
                          onChange={(e) => handleInputChange("fullName", e.target.value)}
                          required
                        />
                      </div>

                      <div className="ok-contact-field">
                        <label htmlFor="inquiry-email">Email Address</label>
                        <input
                          id="inquiry-email"
                          type="email"
                          placeholder="e.g. john@example.com"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          required
                        />
                      </div>

                      <div className="ok-contact-field">
                        <label htmlFor="inquiry-phone">Phone Number</label>
                        <div className="ok-contact-phone-wrapper">
                          <PhoneInput
                            disableFormatting
                            defaultCountry="ng"
                            value={phoneVal}
                            onChange={handlePhoneChange}
                            inputClassName="ok-input"
                            countrySelectorStyleProps={{
                              buttonClassName: "ok-phone-flag-btn",
                            }}
                          />
                        </div>
                      </div>

                      <div className="ok-contact-field">
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <label className="mb-0" htmlFor="inquiry-whatsapp">WhatsApp Number</label>
                          <label className="ok-contact-checkbox-wrapper mb-0">
                            <input
                              type="checkbox"
                              checked={sameAsPhone}
                              onChange={(e) => handleSameAsPhoneToggle(e.target.checked)}
                            />
                            <span>Same as phone</span>
                          </label>
                        </div>
                        <div className="ok-contact-phone-wrapper">
                          <PhoneInput
                            disableFormatting
                            defaultCountry="ng"
                            value={sameAsPhone ? phoneVal : whatsappVal}
                            onChange={handleWhatsappChange}
                            disabled={sameAsPhone}
                            inputClassName="ok-input"
                            countrySelectorStyleProps={{
                              buttonClassName: "ok-phone-flag-btn",
                            }}
                          />
                        </div>
                      </div>

                      <div className="ok-contact-field ok-contact-field--full">
                        <label htmlFor="inquiry-message">Message</label>
                        <textarea
                          id="inquiry-message"
                          rows={5}
                          placeholder="Please share details about the vehicle, estimated delivery timeline, or any questions you have..."
                          value={formData.customerMessage}
                          onChange={(e) => handleInputChange("customerMessage", e.target.value)}
                          required
                        />
                      </div>

                      <div className="ok-contact-submit ok-contact-field--full">
                        <button
                          type="submit"
                          className="ok-home-btn ok-home-btn--primary"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 size={16} className="spinner-border spinner-border-sm" />
                              Sending Message...
                            </>
                          ) : (
                            <>
                              <Send size={16} />
                              Send Message
                            </>
                          )}
                        </button>
                        <p>
                          We use your details only to answer your inquiry and help
                          with the export process.
                        </p>
                      </div>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


