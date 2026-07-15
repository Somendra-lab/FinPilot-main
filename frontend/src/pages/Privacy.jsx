import Layout from '../components/Layout';
import './Legal.css';
export default function Privacy() {
  return <Layout>
      <div className="legal-page">
        <div className="legal-container">
          <h1>Privacy Policy</h1>
          <p className="last-updated">Last Updated: {new Date().toLocaleDateString()}</p>

          <section>
            <h2>1. Introduction</h2>
            <p>
              Welcome to FinPilot AI. We are committed to protecting your privacy and ensuring you have a
              positive experience on our platform. This Privacy Policy outlines how we collect, use, disclose, and
              safeguard your information.
            </p>
          </section>

          <section>
            <h2>2. Information We Collect</h2>
            <p>We may collect the following types of information:</p>
            <ul>
              <li><strong>Personal Information:</strong> Name, email address, phone number, and other contact details</li>
              <li><strong>Financial Information:</strong> Transaction data, budget information, and financial goals</li>
              <li><strong>Usage Data:</strong> Information about how you use the platform</li>
              <li><strong>Device Information:</strong> IP address, browser type, and device information</li>
            </ul>
          </section>

          <section>
            <h2>3. How We Use Your Information</h2>
            <p>We use the collected information to:</p>
            <ul>
              <li>Provide and maintain our services</li>
              <li>Improve and personalize your experience</li>
              <li>Send you updates and promotional materials</li>
              <li>Process transactions and send related information</li>
              <li>Provide customer support</li>
              <li>Analyze usage patterns and trends</li>
            </ul>
          </section>

          <section>
            <h2>4. Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your personal information
              against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission
              over the internet is 100% secure.
            </p>
          </section>

          <section>
            <h2>5. Third-Party Disclosure</h2>
            <p>
              We do not sell, trade, or rent your personal information to third parties. We may share information
              with trusted service providers who assist us in operating our website and conducting our business.
            </p>
          </section>

          <section>
            <h2>6. Contact Us</h2>
            <p>If you have questions about this Privacy Policy, please contact us at:</p>
            <p>
              Email: <a href="mailto:somendraprataps966@gmail.com">somendraprataps966@gmail.com</a>
              <br />
              Phone: <a href="tel:+918400029870">+91 8400029870</a>
            </p>
          </section>
        </div>
      </div>
    </Layout>;
}