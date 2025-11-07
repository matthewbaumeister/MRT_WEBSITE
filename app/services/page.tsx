import { services } from "@/lib/services";
import ServiceCard from "@/components/ServiceCard";
import Button from "@/components/ui/Button";

export const metadata = {
  title: "Services - Make Ready Consulting",
  description:
    "Comprehensive government consulting services including AI, Program Management, Geospatial Science, IT Support, Data Analytics, and Corporate Support.",
};

export default function ServicesPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-dark-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            SERVICE OFFERINGS
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto">
            At Make Ready Tech, we transform challenges into opportunities
            through cutting-edge technology and expert support.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {services.map((service, index) => (
              <ServiceCard key={index} {...service} />
            ))}
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Ready to get started?
            </h2>
            <Button href="/contact" variant="primary" size="lg">
              Enquire Now
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

