import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ContactUs = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
  };

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
            📞 Contact Us
          </h1>
          <p style={{ fontSize: "1.2rem", color: "#6b7280" }}>
            We're here to help! Send us your questions.
          </p>
        </div>

        <div
          style={{
            background: "white",
            padding: "30px",
            borderRadius: "10px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            marginBottom: "20px",
          }}
        >
          {isSubmitted ? (
            <div style={{ textAlign: "center", padding: "40px" }}>
              <div style={{ fontSize: "3rem", marginBottom: "20px" }}>❤️</div>
              <h3 style={{ color: "#059669", marginBottom: "10px" }}>
                Message Sent!
              </h3>
              <p style={{ color: "#059669" }}>
                We'll respond to <strong>symmetry786@gmail.com</strong> within
                24 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "20px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "5px",
                    fontWeight: "bold",
                  }}
                >
                  Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                    fontSize: "16px",
                  }}
                />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "5px",
                    fontWeight: "bold",
                  }}
                >
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                    fontSize: "16px",
                  }}
                />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "5px",
                    fontWeight: "bold",
                  }}
                >
                  Message
                </label>
                <textarea
                  rows={4}
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  required
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                    fontSize: "16px",
                    resize: "vertical",
                  }}
                />
              </div>

              <button
                type="submit"
                style={{
                  width: "100%",
                  padding: "15px",
                  background: "#059669",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  fontSize: "16px",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                Send Message
              </button>
            </form>
          )}
        </div>

        {/* Contact Methods */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "20px",
            marginBottom: "30px",
          }}
        >
          <div
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "10px",
              textAlign: "center",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            <div style={{ fontSize: "2rem", marginBottom: "10px" }}>📧</div>
            <h3 style={{ marginBottom: "5px" }}>Email Support</h3>
            <p
              style={{
                color: "#6b7280",
                fontSize: "14px",
                marginBottom: "10px",
              }}
            >
              Get help via email
            </p>
            <a
              href="mailto:symmetry786@gmail.com"
              style={{ color: "#3b82f6", fontWeight: "bold" }}
            >
              symmetry786@gmail.com
            </a>
          </div>

          <div
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "10px",
              textAlign: "center",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            <div style={{ fontSize: "2rem", marginBottom: "10px" }}>⚡</div>
            <h3 style={{ marginBottom: "5px" }}>Quick Response</h3>
            <p
              style={{
                color: "#6b7280",
                fontSize: "14px",
                marginBottom: "10px",
              }}
            >
              We respond within
            </p>
            <span style={{ color: "#059669", fontWeight: "bold" }}>
              24 Hours
            </span>
          </div>

          <div
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "10px",
              textAlign: "center",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            <div style={{ fontSize: "2rem", marginBottom: "10px" }}>🆘</div>
            <h3 style={{ marginBottom: "5px" }}>Help Center</h3>
            <p
              style={{
                color: "#6b7280",
                fontSize: "14px",
                marginBottom: "10px",
              }}
            >
              Find answers instantly
            </p>
            <button
              onClick={() => navigate("/help")}
              style={{
                background: "#3b82f6",
                color: "white",
                border: "none",
                padding: "8px 16px",
                borderRadius: "4px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Visit Help Center
            </button>
          </div>
        </div>

        <div
          style={{
            background: "#dbeafe",
            padding: "20px",
            borderRadius: "10px",
            textAlign: "center",
          }}
        >
          <h3 style={{ marginBottom: "10px" }}>Direct Contact</h3>
          <p>
            Email:{" "}
            <a
              href="mailto:symmetry786@gmail.com"
              style={{ color: "#2563eb", fontWeight: "bold" }}
            >
              symmetry786@gmail.com
            </a>
          </p>
          <p style={{ fontSize: "0.9rem", color: "#6b7280" }}>
            Response time: Within 24 hours
          </p>
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

export default ContactUs;
