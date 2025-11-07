import ContactForm from "@/components/ContactForm";

export const metadata = {
  title: "Contact Us - Make Ready Consulting",
  description:
    "Get in touch with Make Ready Consulting. We're here to help with your government consulting needs.",
};

export default function ContactPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-dark-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Contact Us</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Ready to transform your operations? Get in touch with our team to
            discuss how we can support your mission.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Information */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                Let's Talk
              </h2>
              
              <div className="space-y-6 mb-12">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg
                      className="w-6 h-6 text-primary-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      Email
                    </h3>
                    <a
                      href="mailto:info@make-ready-consulting.com"
                      className="text-primary-600 hover:text-primary-700 transition-colors"
                    >
                      info@make-ready-consulting.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg
                      className="w-6 h-6 text-primary-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      Address
                    </h3>
                    <p className="text-gray-600">
                      9409 B Battle Street
                      <br />
                      Manassas, VA 20110
                    </p>
                  </div>
                </div>
              </div>

              {/* Image */}
              <div className="relative h-80 rounded-lg overflow-hidden shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-primary-800">
                  {/* Placeholder for consultation image */}
                  <div className="absolute inset-0 bg-[url('/images/consultation.jpg')] bg-cover bg-center opacity-30" />
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Send us a message
              </h2>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* Map or Additional Info Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Business Hours
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              We're here to support your mission around the clock.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Standard Hours
                </h3>
                <p className="text-gray-600">
                  Monday - Friday: 8:00 AM - 6:00 PM EST
                  <br />
                  Saturday - Sunday: Closed
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Emergency Support
                </h3>
                <p className="text-gray-600">
                  24/7 support available for critical mission needs and existing
                  clients.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

