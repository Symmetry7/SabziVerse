import React from "react";
import { useNavigate } from "react-router-dom";

const TermsOfService = () => {
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
            📋 Terms of Service
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
              1. Agreement to Terms
            </h2>
            <p>
              By accessing and using SabziVerse, you accept and agree to be
              bound by the terms and provision of this agreement. If you do not
              agree to abide by the above, please do not use this service.
            </p>
          </section>

          <section style={{ marginBottom: "30px" }}>
            <h2 style={{ color: "#1f2937", marginBottom: "15px" }}>
              2. Use License
            </h2>
            <p>
              Permission is granted to temporarily download one copy of
              SabziVerse materials for personal, non-commercial transitory
              viewing only. This is the grant of a license, not a transfer of
              title, and under this license you may not:
            </p>
            <ul style={{ marginLeft: "20px", marginTop: "10px" }}>
              <li>modify or copy the materials</li>
              <li>
                use the materials for any commercial purpose or for any public
                display
              </li>
              <li>attempt to decompile or reverse engineer any software</li>
              <li>remove any copyright or other proprietary notations</li>
            </ul>
          </section>

          <section style={{ marginBottom: "30px" }}>
            <h2 style={{ color: "#1f2937", marginBottom: "15px" }}>
              3. User Accounts
            </h2>
            <p>
              When you create an account with us, you must provide information
              that is accurate, complete, and current at all times. You are
              responsible for safeguarding the password and for all activities
              that occur under your account.
            </p>
          </section>

          <section style={{ marginBottom: "30px" }}>
            <h2 style={{ color: "#1f2937", marginBottom: "15px" }}>
              4. Farmer Responsibilities
            </h2>
            <p>Farmers using SabziVerse agree to:</p>
            <ul style={{ marginLeft: "20px", marginTop: "10px" }}>
              <li>Provide accurate crop information and pricing</li>
              <li>Maintain quality standards as described in listings</li>
              <li>Communicate honestly with potential buyers</li>
              <li>Honor sample delivery commitments when offered</li>
            </ul>
          </section>

          <section style={{ marginBottom: "30px" }}>
            <h2 style={{ color: "#1f2937", marginBottom: "15px" }}>
              5. Buyer Responsibilities
            </h2>
            <p>Buyers using SabziVerse agree to:</p>
            <ul style={{ marginLeft: "20px", marginTop: "10px" }}>
              <li>Communicate respectfully with farmers</li>
              <li>Honor purchase commitments made</li>
              <li>Provide fair feedback and ratings</li>
              <li>Report any issues through proper channels</li>
            </ul>
          </section>

          <section style={{ marginBottom: "30px" }}>
            <h2 style={{ color: "#1f2937", marginBottom: "15px" }}>
              6. Platform Usage
            </h2>
            <p>
              SabziVerse serves as a connection platform between farmers and
              buyers. We do not participate in actual transactions and are not
              responsible for the quality, safety, or legality of items
              advertised, the truth or accuracy of listings, or the ability of
              users to sell or buy items.
            </p>
          </section>

          <section style={{ marginBottom: "30px" }}>
            <h2 style={{ color: "#1f2937", marginBottom: "15px" }}>
              7. Privacy Policy
            </h2>
            <p>
              Your privacy is important to us. Please review our Privacy Policy,
              which also governs your use of SabziVerse, to understand our
              practices.
            </p>
          </section>

          <section style={{ marginBottom: "30px" }}>
            <h2 style={{ color: "#1f2937", marginBottom: "15px" }}>
              8. Prohibited Uses
            </h2>
            <p>You may not use our service:</p>
            <ul style={{ marginLeft: "20px", marginTop: "10px" }}>
              <li>
                For any unlawful purpose or to solicit others to unlawful acts
              </li>
              <li>
                To violate any international, federal, provincial, or state
                regulations, rules, laws, or local ordinances
              </li>
              <li>
                To infringe upon or violate our intellectual property rights or
                the intellectual property rights of others
              </li>
              <li>
                To harass, abuse, insult, harm, defame, slander, disparage,
                intimidate, or discriminate
              </li>
            </ul>
          </section>

          <section style={{ marginBottom: "30px" }}>
            <h2 style={{ color: "#1f2937", marginBottom: "15px" }}>
              9. Disclaimer
            </h2>
            <p>
              The information on this platform is provided on an 'as is' basis.
              To the fullest extent permitted by law, this Company excludes all
              representations, warranties, conditions and other terms which
              might otherwise be implied by statute, common law or the law of
              equity.
            </p>
          </section>

          <section style={{ marginBottom: "30px" }}>
            <h2 style={{ color: "#1f2937", marginBottom: "15px" }}>
              10. Contact Information
            </h2>
            <p>
              If you have any questions about these Terms of Service, please
              contact us at:
              <br />
              <strong>Email:</strong> symmetry786@gmail.com
              <br />
              <strong>Response Time:</strong> Within 24 hours
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

export default TermsOfService;
