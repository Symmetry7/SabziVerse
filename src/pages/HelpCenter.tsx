import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const HelpCenter = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const faqs = [
    {
      q: "What is SabziVerse?",
      a: "SabziVerse is a platform that connects farmers directly with buyers across India, eliminating middlemen and ensuring fair prices for both parties.",
    },
    {
      q: "How do I create an account?",
      a: "Click on either 'I am a Farmer' or 'I am a Buyer' on the homepage, then click 'Create Account' and fill in your details.",
    },
    {
      q: "Is SabziVerse free to use?",
      a: "Yes! SabziVerse is completely free for both farmers and buyers. We don't charge any commission on transactions.",
    },
    {
      q: "How can I contact farmers directly?",
      a: "Use the 'Contact Farmer' button on any crop listing to send a direct message to the farmer.",
    },
    {
      q: "What languages are supported?",
      a: "SabziVerse supports 12 Indian languages including Hindi, English, Bengali, Tamil, Telugu, Marathi, and more.",
    },
    {
      q: "How do I upload my crops as a farmer?",
      a: "Go to your farmer dashboard and click 'Add Crop' to upload details, photos, and pricing for your produce.",
    },
    {
      q: "Can I get samples before buying?",
      a: "Many farmers offer sample delivery. Look for the 'Sample Available' badge on crop listings.",
    },
    {
      q: "How do I edit my profile?",
      a: "Click the 'Edit Profile' button next to your avatar in the dashboard to update your information.",
    },
    {
      q: "What is Aadhaar login?",
      a: "You can login securely using your 12-digit Aadhaar number instead of your phone number for faster access.",
    },
    {
      q: "How do I set price alerts?",
      a: "Use the Smart Recommendations section to set up price alerts for specific crops and get notified when prices drop.",
    },
  ];

  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const filteredFAQs = faqs.filter(
    (faq) =>
      faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.a.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom right, #f0f9ff, #e0e7ff)",
        padding: "20px",
      }}
    >
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <button
          onClick={() => navigate("/")}
          style={{
            background: "none",
            border: "1px solid #ccc",
            padding: "10px 20px",
            borderRadius: "5px",
            cursor: "pointer",
            marginBottom: "20px",
          }}
        >
          ← Back to Home
        </button>

        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <h1
            style={{
              fontSize: "2.5rem",
              color: "#1f2937",
              marginBottom: "10px",
            }}
          >
            🆘 Help Center
          </h1>
          <p style={{ fontSize: "1.2rem", color: "#6b7280" }}>
            Find answers to frequently asked questions
          </p>
        </div>

        {/* Search */}
        <div
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            marginBottom: "20px",
          }}
        >
          <input
            type="text"
            placeholder="Search help topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              padding: "15px",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
              fontSize: "16px",
            }}
          />
        </div>

        {/* FAQs */}
        <div
          style={{
            background: "white",
            borderRadius: "10px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            overflow: "hidden",
          }}
        >
          {filteredFAQs.map((faq, index) => (
            <div key={index} style={{ borderBottom: "1px solid #e5e7eb" }}>
              <button
                onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                style={{
                  width: "100%",
                  padding: "20px",
                  textAlign: "left",
                  border: "none",
                  background: openFAQ === index ? "#f3f4f6" : "white",
                  cursor: "pointer",
                  fontSize: "16px",
                  fontWeight: "500",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span>{faq.q}</span>
                <span style={{ fontSize: "18px", color: "#6b7280" }}>
                  {openFAQ === index ? "−" : "+"}
                </span>
              </button>
              {openFAQ === index && (
                <div
                  style={{
                    padding: "0 20px 20px",
                    color: "#4b5563",
                    lineHeight: "1.6",
                  }}
                >
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div
          style={{
            background: "#dbeafe",
            padding: "30px",
            borderRadius: "10px",
            textAlign: "center",
            marginTop: "30px",
          }}
        >
          <h3 style={{ marginBottom: "15px", color: "#1e40af" }}>
            Still Need Help?
          </h3>
          <p style={{ marginBottom: "20px", color: "#374151" }}>
            Can't find what you're looking for? Contact our support team.
          </p>
          <button
            onClick={() => navigate("/contact")}
            style={{
              background: "#3b82f6",
              color: "white",
              border: "none",
              padding: "12px 24px",
              borderRadius: "6px",
              fontSize: "16px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Contact Support
          </button>
        </div>

        <div style={{ textAlign: "center", marginTop: "30px" }}>
          <p>
            Made with ❤️ by{" "}
            <strong style={{ color: "#7c3aed" }}>Symmetry</strong>
          </p>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;
