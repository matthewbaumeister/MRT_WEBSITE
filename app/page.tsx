import Image from "next/image";
import Button from "@/components/ui/Button";
import ServiceCard from "@/components/ServiceCard";
import ContactForm from "@/components/ContactForm";
import { services } from "@/lib/services";

export default function Home() {

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center">
        <div className="absolute inset-0 bg-dark-900">
          <div className="absolute inset-0 bg-gradient-to-r from-dark-900/95 to-dark-900/60" />
          <Image
            src="/images/hero-soldier.jpg"
            alt="Military Service"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="relative z-10 text-center px-4">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-8">
            Strategic Solutions for
            <br />
            <span className="text-accent-400">Government Success</span>
          </h1>
          <Button href="/services" variant="secondary" size="lg">
            LEARN MORE
          </Button>
        </div>
      </section>

      {/* Veteran Owned Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative h-96 lg:h-[500px] bg-gradient-to-br from-primary-600 to-primary-800 rounded-lg shadow-xl p-8 flex flex-col justify-between text-white">
              <div>
                <h3 className="text-3xl font-bold mb-6 text-white">
                  Small Business Certifications
                </h3>
                <div className="space-y-6">
                  <div className="flex items-start bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-accent-500 rounded-full flex items-center justify-center mr-4">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-accent-400 mb-1">Veteran Owned</h4>
                      <p className="text-sm text-gray-200">Founded and operated by proud U.S. military veterans</p>
                    </div>
                  </div>

                  <div className="flex items-start bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-accent-500 rounded-full flex items-center justify-center mr-4">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-accent-400 mb-1">Service Disabled Veteran Owned Small Business</h4>
                      <p className="text-sm text-gray-200">SDVOSB certified for federal contracting</p>
                    </div>
                  </div>

                  <div className="flex items-start bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-accent-500 rounded-full flex items-center justify-center mr-4">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-accent-400 mb-1">Native American Owned</h4>
                      <p className="text-sm text-gray-200">Native American owned business enterprise</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-white/20 pt-6 mt-6">
                <p className="text-sm text-gray-200 text-center">
                  Qualified for set-aside contracts and priority consideration in federal procurement
                </p>
              </div>
            </div>
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Proudly Veteran Owned
                <br />
                <span className="text-primary-600">And Operated</span>
              </h2>
              <p className="text-xl text-gray-700 mb-8">
                Providing the US Government solutions and services to better
                prepare for tomorrows challenges
              </p>
              <Button href="/about" variant="primary" size="lg">
                OUR TEAM
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Service Offerings Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Service Offerings
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              At Make Ready Tech, we transform challenges into opportunities
              through cutting-edge technology and expert support.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <ServiceCard key={index} {...service} />
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-8">
                Ready to <span className="text-accent-400">Connect?</span>
              </h2>
              <div className="relative h-96 rounded-lg overflow-hidden bg-gradient-to-br from-primary-600 to-primary-800 p-8 flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-6">
                    Partner with Make Ready
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <svg className="w-8 h-8 text-accent-400 mr-4 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      <div>
                        <p className="text-white font-semibold text-lg">Trusted Government Partner</p>
                        <p className="text-gray-300">Serving DoD and intelligence community</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <svg className="w-8 h-8 text-accent-400 mr-4 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <p className="text-white font-semibold text-lg">Rapid Response</p>
                        <p className="text-gray-300">24-hour inquiry response guarantee</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <svg className="w-8 h-8 text-accent-400 mr-4 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <div>
                        <p className="text-white font-semibold text-lg">Expert Team</p>
                        <p className="text-gray-300">Veteran-led with 50+ combined years experience</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="border-t border-white/20 pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-accent-400 font-semibold text-sm">Small Business Certified</p>
                      <p className="text-white text-xs">SDVOSB • Veteran Owned • Native American Owned</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-8">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

