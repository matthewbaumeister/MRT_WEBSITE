import Button from "@/components/ui/Button";
import ContactForm from "@/components/ContactForm";

export const metadata = {
  title: "Matrix - Make Ready Consulting",
  description:
    "Matrix is an advanced platform for data integration, analysis, and visualization designed for government and defense applications.",
};

export default function MatrixPage() {
  const features = [
    {
      title: "Data Integration",
      description:
        "Seamlessly integrate data from multiple sources into a unified platform for comprehensive analysis.",
    },
    {
      title: "Advanced Visualization",
      description:
        "Transform complex data into clear, actionable visualizations that drive better decision-making.",
    },
    {
      title: "Collaborative Environment",
      description:
        "Enable team collaboration with shared workspaces and real-time data synchronization.",
    },
    {
      title: "Custom Workflows",
      description:
        "Build custom workflows tailored to your specific operational requirements and processes.",
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-accent-900 via-accent-700 to-accent-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">Matrix</h1>
            <p className="text-xl md:text-2xl text-accent-100 mb-8">
              Unify Your Data, Amplify Your Insights
            </p>
            <p className="text-lg text-accent-200 mb-12">
              Matrix is a powerful platform that brings together disparate data
              sources, enabling comprehensive analysis and visualization for
              mission-critical operations and strategic planning.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button href="#demo" variant="primary" size="lg">
                Request Demo
              </Button>
              <Button
                href="/contact"
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-accent-600"
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
              Key Capabilities
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Matrix delivers enterprise-grade capabilities designed for the most
              demanding operational environments.
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

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-12 text-center">
              Why Choose Matrix
            </h2>
            <div className="space-y-8">
              <div className="bg-white rounded-lg p-8 shadow-md">
                <h3 className="text-2xl font-bold text-accent-600 mb-4">
                  Enhanced Situational Awareness
                </h3>
                <p className="text-gray-700">
                  Gain comprehensive visibility across all your data sources with
                  integrated dashboards and real-time updates.
                </p>
              </div>
              <div className="bg-white rounded-lg p-8 shadow-md">
                <h3 className="text-2xl font-bold text-accent-600 mb-4">
                  Accelerated Decision-Making
                </h3>
                <p className="text-gray-700">
                  Make faster, more informed decisions with instant access to
                  analyzed and visualized data.
                </p>
              </div>
              <div className="bg-white rounded-lg p-8 shadow-md">
                <h3 className="text-2xl font-bold text-accent-600 mb-4">
                  Improved Collaboration
                </h3>
                <p className="text-gray-700">
                  Break down silos and enable seamless collaboration across teams
                  and departments.
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
                Experience Matrix
              </h2>
              <p className="text-xl text-gray-300">
                Schedule a personalized demo and see how Matrix can revolutionize
                your data operations.
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

