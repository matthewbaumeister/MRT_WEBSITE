export const metadata = {
  title: "Terms & Conditions - Make Ready Consulting",
  description:
    "Terms and conditions for using Make Ready Consulting services and website.",
};

export default function TermsPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-dark-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Terms & Conditions
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Please read these terms and conditions carefully before using our
            services.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              1. Acceptance of Terms
            </h2>
            <p className="text-gray-700 mb-6">
              By accessing and using the Make Ready Consulting website and
              services, you accept and agree to be bound by the terms and
              provisions of this agreement. If you do not agree to these terms,
              please do not use our services.
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              2. Use of Services
            </h2>
            <p className="text-gray-700 mb-6">
              Make Ready Consulting provides strategic consulting and technology
              services primarily to government agencies. Our services include
              Program Management, Artificial Intelligence solutions, Geospatial
              Science, IT Support, Data Analytics, and Corporate Support. You
              agree to use our services only for lawful purposes and in
              accordance with these terms.
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              3. Intellectual Property
            </h2>
            <p className="text-gray-700 mb-6">
              All content on this website, including but not limited to text,
              graphics, logos, images, and software, is the property of Make
              Ready Consulting or its content suppliers and is protected by
              United States and international copyright laws. Unauthorized use of
              any content may violate copyright, trademark, and other laws.
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              4. Confidentiality and Security
            </h2>
            <p className="text-gray-700 mb-6">
              Given the nature of our work with government agencies and sensitive
              information, all parties agree to maintain strict confidentiality
              regarding any proprietary or classified information shared during
              the course of our business relationship. Additional
              non-disclosure agreements may be required for specific projects.
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              5. Limitation of Liability
            </h2>
            <p className="text-gray-700 mb-6">
              Make Ready Consulting shall not be liable for any indirect,
              incidental, special, consequential, or punitive damages resulting
              from your use of or inability to use our services. Our total
              liability shall not exceed the amount paid by you for the specific
              service giving rise to the claim.
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              6. Disclaimer of Warranties
            </h2>
            <p className="text-gray-700 mb-6">
              Our services are provided "as is" without warranty of any kind,
              either express or implied. We make no representations or warranties
              regarding the accuracy, reliability, or completeness of any
              information provided through our services.
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              7. Modifications to Terms
            </h2>
            <p className="text-gray-700 mb-6">
              Make Ready Consulting reserves the right to modify these terms and
              conditions at any time. Changes will be effective immediately upon
              posting to our website. Your continued use of our services after
              any changes constitutes acceptance of the modified terms.
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              8. Governing Law
            </h2>
            <p className="text-gray-700 mb-6">
              These terms and conditions shall be governed by and construed in
              accordance with the laws of the Commonwealth of Virginia, without
              regard to its conflict of law provisions. Any disputes arising from
              these terms shall be resolved in the courts of Virginia.
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              9. Contact Information
            </h2>
            <p className="text-gray-700 mb-6">
              If you have any questions about these Terms & Conditions, please
              contact us:
            </p>
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <p className="text-gray-700">
                <strong>Make Ready Consulting</strong>
                <br />
                9409 B Battle Street
                <br />
                Manassas, VA 20110
                <br />
                <a
                  href="mailto:info@make-ready-consulting.com"
                  className="text-primary-600 hover:text-primary-700"
                >
                  info@make-ready-consulting.com
                </a>
              </p>
            </div>

            <p className="text-sm text-gray-500 italic">
              Last Updated: November 2024
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

