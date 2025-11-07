import Button from "@/components/ui/Button";
import ContactForm from "@/components/ContactForm";
import Link from "next/link";

export const metadata = {
  title: "Matrix - AI Market Research Platform | Make Ready Consulting",
  description:
    "Matrix is an AI-powered market research and intelligence platform delivering comprehensive market analysis, competitive intelligence, and strategic insights for government and defense sectors.",
};

export default function MatrixPage() {
  const features = [
    {
      title: "AI-Powered Market Analysis",
      description:
        "Leverage advanced artificial intelligence and machine learning to analyze market trends, identify opportunities, and predict future developments with unprecedented accuracy.",
    },
    {
      title: "Competitive Intelligence",
      description:
        "Gain deep insights into competitor strategies, capabilities, and positioning. Monitor market movements and competitive threats in real-time.",
    },
    {
      title: "Strategic Market Research",
      description:
        "Comprehensive market research reports covering industry trends, customer segments, market sizing, and growth projections tailored for government contractors.",
    },
    {
      title: "Automated Data Collection",
      description:
        "Continuously gather and process market data from thousands of sources including government databases, industry reports, and public records.",
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
              AI-Powered Market Research & Intelligence
            </p>
            <p className="text-lg text-accent-200 mb-12">
              Matrix is an advanced AI-powered market research platform specifically designed
              for government contractors. Unify vendor intelligence, accelerate acquisition cycles,
              and leverage predictive analytics to win more contracts. Our neural graph
              architecture processes over 500,000 interconnected data points from 19+ federal
              feeds to deliver Army-specific intelligence you can't find anywhere else.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/login"
                className="inline-flex items-center justify-center px-8 py-4 text-lg bg-white text-primary-600 hover:bg-primary-600 hover:text-white font-bold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Try It Now →
              </Link>
              <Button href="#demo" variant="secondary" size="lg">
                Request Demo
              </Button>
              <Button
                href="/contact"
                variant="outline"
                size="lg"
                className="border-2 border-white text-white hover:bg-white hover:text-accent-600 font-semibold"
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
              Matrix combines AI-powered analysis with comprehensive market intelligence
              to deliver actionable insights for government contractors and defense organizations.
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
                  Win More Contracts
                </h3>
                <p className="text-gray-700">
                  Identify high-value opportunities before your competitors. Matrix analyzes
                  government contracting data, budget allocations, and agency priorities to
                  help you target the right opportunities at the right time.
                </p>
              </div>
              <div className="bg-white rounded-lg p-8 shadow-md">
                <h3 className="text-2xl font-bold text-accent-600 mb-4">
                  Accelerate Capture & Proposal Development
                </h3>
                <p className="text-gray-700">
                  Build stronger proposals with comprehensive market intelligence. Access
                  competitor analysis, past performance data, pricing benchmarks, and
                  customer insights all in one place.
                </p>
              </div>
              <div className="bg-white rounded-lg p-8 shadow-md">
                <h3 className="text-2xl font-bold text-accent-600 mb-4">
                  Strategic Market Intelligence
                </h3>
                <p className="text-gray-700">
                  Stay ahead of market trends with AI-powered predictive analytics. Understand
                  emerging technologies, budget shifts, and policy changes that impact your
                  business development strategy.
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

