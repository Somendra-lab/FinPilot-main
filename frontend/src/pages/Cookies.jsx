import Layout from '../components/Layout';
import './Legal.css';
export default function Cookies() {
  return <Layout>
      <div className="legal-page">
        <div className="legal-container">
          <h1>Cookie Policy</h1>
          <p className="last-updated">Last Updated: {new Date().toLocaleDateString()}</p>

          <section>
            <h2>1. What Are Cookies?</h2>
            <p>
              Cookies are small text files that are stored on your device (computer, tablet, or mobile phone)
              when you visit our website. They are widely used to make websites work more efficiently and to
              provide information to the owners of the site.
            </p>
          </section>

          <section>
            <h2>2. How We Use Cookies</h2>
            <p>FinPilot AI uses cookies for the following purposes:</p>
            <ul>
              <li><strong>Essential Cookies:</strong> Required for the basic functioning of the website</li>
              <li><strong>Performance Cookies:</strong> Help us understand how visitors use our website</li>
              <li><strong>Functional Cookies:</strong> Remember your preferences and settings</li>
              <li><strong>Targeting Cookies:</strong> Used to deliver relevant content and advertisements</li>
            </ul>
          </section>

          <section>
            <h2>3. Third-Party Cookies</h2>
            <p>
              Some cookies may be placed on your device by third parties, such as advertising partners and
              analytics providers. We do not control these cookies, and you should check the third party's website
              for information about their cookies.
            </p>
          </section>

          <section>
            <h2>4. Managing Cookies</h2>
            <p>
              You can control and manage cookies in various ways. Most web browsers allow you to refuse cookies
              or alert you when a cookie is being sent. You can also delete cookies from your device.
            </p>
          </section>

          <section>
            <h2>5. Local Storage</h2>
            <p>
              We may use local storage technologies (such as HTML5) to store information on your device. These
              technologies work similarly to cookies but may store larger amounts of data.
            </p>
          </section>

          <section>
            <h2>6. Changes to This Policy</h2>
            <p>
              We may update this Cookie Policy from time to time to reflect changes in our practices or for other
              operational, legal, or regulatory reasons. We will notify you of any material changes by posting the
              updated policy on our website.
            </p>
          </section>

          <section>
            <h2>7. Contact Us</h2>
            <p>If you have questions about our Cookie Policy, please contact us at:</p>
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