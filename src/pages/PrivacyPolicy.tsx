import React from "react";
import { useNavigate } from "react-router-dom";

const PrivacyPolicy = () => {
  const navigate = useNavigate();

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
            🔒 Privacy Policy
          </h1>
          <p style={{ fontSize: "1rem", color: "#6b7280" }}>
            Last updated: January 2025
          </p>
        </div>

        <div
          style={{
            background: "white",
            padding: "40px",
            borderRadius: "10px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            lineHeight: "1.6",
            color: "#374151",
          }}
        >
          <section style={{ marginBottom: "30px" }}>
            <h2 style={{ color: "#1f2937", marginBottom: "15px" }}>
              Information We Collect
            </h2>
            <p>
              We collect information you provide directly to us, such as when
              you create an account, list crops, or contact other users. This
              may include:
            </p>
            <ul style={{ marginLeft: "20px", marginTop: "10px" }}>
              <li>Name and contact information (phone number, location)</li>
              <li>Aadhaar card number (optional, for verification)</li>
              <li>Crop listings and product information</li>
              <li>Messages and communications through our platform</li>
              <li>Language preferences and usage data</li>
            </ul>
          </section>

          <section style={{ marginBottom: "30px" }}>
            <h2 style={{ color: "#1f2937", marginBottom: "15px" }}>
              How We Use Your Information
            </h2>
            <p>We use the information we collect to:</p>
            <ul style={{ marginLeft: "20px", marginTop: "10px" }}>
              <li>Provide, maintain, and improve our services</li>
              <li>Connect farmers with buyers effectively</li>
              <li>
                Send you notifications about your account and platform updates
              </li>
              <li>Provide customer support and respond to your requests</li>
              <li>Ensure security and prevent fraud</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section style={{ marginBottom: "30px" }}>
            <h2 style={{ color: "#1f2937", marginBottom: "15px" }}>
              Information Sharing
            </h2>
            <p>
              We do not sell, trade, or otherwise transfer your personal
              information to third parties. We may share your information only
              in the following circumstances:
            </p>
            <ul style={{ marginLeft: "20px", marginTop: "10px" }}>
              <li>
                With other users as necessary to facilitate transactions (e.g.,
                contact information)
              </li>
              <li>When required by law or to respond to legal process</li>
              <li>
                To protect our rights, property, or safety, or that of others
              </li>
              <li>With your explicit consent</li>
            </ul>
          </section>

          <section style={{ marginBottom: "30px" }}>
            <h2 style={{ color: "#1f2937", marginBottom: "15px" }}>
              Aadhaar Information Security
            </h2>
            <p>
              We treat Aadhaar information with the highest level of security:
            </p>
            <ul style={{ marginLeft: "20px", marginTop: "10px" }}>
              <li>Aadhaar numbers are encrypted and stored securely</li>
              <li>Used only for authentication and verification purposes</li>
              <li>Never shared with other users or third parties</li>
              <li>Compliant with Aadhaar Act 2016 and UIDAI guidelines</li>
            </ul>
          </section>

          <section style={{ marginBottom: "30px" }}>
            <h2 style={{ color: "#1f2937", marginBottom: "15px" }}>
              Data Storage
            </h2>
            <p>
              Your data is stored locally on your device and in secure servers.
              We implement appropriate security measures to protect against
              unauthorized access, alteration, disclosure, or destruction of
              your personal information.
            </p>
          </section>

          <section style={{ marginBottom: "30px" }}>
            <h2 style={{ color: "#1f2937", marginBottom: "15px" }}>
              Your Rights
            </h2>
            <p>You have the right to:</p>
            <ul style={{ marginLeft: "20px", marginTop: "10px" }}>
              <li>Access and update your personal information</li>
              <li>Delete your account and associated data</li>
              <li>Control what information is shared with other users</li>
              <li>Opt out of non-essential communications</li>
              <li>Request a copy of your data</li>
            </ul>
          </section>

          <section style={{ marginBottom: "30px" }}>
            <h2 style={{ color: "#1f2937", marginBottom: "15px" }}>
              Cookies and Tracking
            </h2>
            <p>
              We use local storage and session storage to enhance your
              experience on our platform. These technologies help us remember
              your preferences, language settings, and keep you logged in
              securely.
            </p>
          </section>

          <section style={{ marginBottom: "30px" }}>
            <h2 style={{ color: "#1f2937", marginBottom: "15px" }}>
              Children's Privacy
            </h2>
            <p>
              Our service is not intended for children under 18 years of age. We
              do not knowingly collect personal information from children under
              18. If you are a parent or guardian and believe your child has
              provided us with personal information, please contact us.
            </p>
          </section>

          <section style={{ marginBottom: "30px" }}>
            <h2 style={{ color: "#1f2937", marginBottom: "15px" }}>
              Changes to Privacy Policy
            </h2>
            <p>
              We may update this Privacy Policy from time to time. We will
              notify you of any changes by posting the new Privacy Policy on
              this page and updating the "Last updated" date.
            </p>
          </section>

          <section style={{ marginBottom: "30px" }}>
            <h2 style={{ color: "#1f2937", marginBottom: "15px" }}>
              Contact Us
            </h2>
            <p>
              If you have any questions about this Privacy Policy, please
              contact us:
              <br />
              <strong>Email:</strong> symmetry786@gmail.com
              <br />
              <strong>Response Time:</strong> Within 24 hours
              <br />
              <strong>Address:</strong> We are committed to protecting your
              privacy and will respond to all inquiries promptly.
            </p>
          </section>
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

export default PrivacyPolicy;
