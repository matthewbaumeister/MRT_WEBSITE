import Button from "@/components/ui/Button";
import ContactForm from "@/components/ContactForm";

export const metadata = {
  title: "Pathfinder - Make Ready Consulting",
  description:
    "Pathfinder is a cutting-edge tool designed to help government agencies navigate complex challenges and make data-driven decisions.",
};

export default function PathfinderPage() {
  const features = [
    {
      title: "Advanced Analytics",
      description:
        "Leverage powerful analytics to gain insights from complex datasets and make informed decisions.",
    },
    {
      title: "Real-Time Intelligence",
      description:
        "Access real-time data processing and intelligence gathering capabilities for mission-critical operations.",
    },
    {
      title: "Secure Infrastructure",
      description:
        "Built with security-first architecture to meet government compliance and data protection standards.",
    },
    {
      title: "Scalable Solutions",
      description:
        "Designed to scale with your organization's needs, from small teams to enterprise deployments.",
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-primary-900 via-primary-700 to-primary-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">Pathfinder</h1>
            <p className="text-xl md:text-2xl text-primary-100 mb-8">
              Navigate Complex Challenges with Precision and Confidence
            </p>
            <p className="text-lg text-primary-200 mb-12">
              Pathfinder is a comprehensive solution designed to help government
              agencies and organizations navigate complex data environments,
              make strategic decisions, and achieve mission success.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button href="#demo" variant="secondary" size="lg">
                Request Demo
              </Button>
              <Button
                href="/contact"
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-primary-600"
              >
                Contact Sales
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Key Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Pathfinder provides the tools and capabilities you need to succeed
              in today's complex operational environment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-lg p-8 hover:shadow-lg transition-shadow duration-300"
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-12 text-center">
              Use Cases
            </h2>
            <div className="space-y-8">
              <div className="bg-white rounded-lg p-8 shadow-md">
                <h3 className="text-2xl font-bold text-primary-600 mb-4">
                  Intelligence Operations
                </h3>
                <p className="text-gray-700">
                  Support intelligence gathering and analysis with advanced data
                  processing capabilities and real-time insights.
                </p>
              </div>
              <div className="bg-white rounded-lg p-8 shadow-md">
                <h3 className="text-2xl font-bold text-primary-600 mb-4">
                  Mission Planning
                </h3>
                <p className="text-gray-700">
                  Enhance mission planning and execution with comprehensive data
                  visualization and strategic decision support.
                </p>
              </div>
              <div className="bg-white rounded-lg p-8 shadow-md">
                <h3 className="text-2xl font-bold text-primary-600 mb-4">
                  Operational Management
                </h3>
                <p className="text-gray-700">
                  Streamline operational workflows and improve efficiency with
                  integrated tools and automated processes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Request Section */}
      <section id="demo" className="py-20 bg-dark-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Request a Demo
              </h2>
              <p className="text-xl text-gray-300">
                See Pathfinder in action and discover how it can transform your
                operations.
              </p>
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

