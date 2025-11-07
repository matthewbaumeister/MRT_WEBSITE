import Image from "next/image";
import Button from "@/components/ui/Button";
import ServiceCard from "@/components/ServiceCard";
import ContactForm from "@/components/ContactForm";

export default function Home() {
  const services = [
    {
      title: "Program Management",
      description: "Driving success through expert program management.",
      fullDescription:
        "Our program management services ensure your projects are delivered on time, within scope, and on budget. We offer comprehensive planning, execution, and monitoring to achieve your strategic goals.",
      imageSrc: "/images/program-management.jpg",
      imageAlt: "Program Management",
    },
    {
      title: "Artificial Intelligence",
      description: "Transforming businesses with cutting-edge AI solutions.",
      fullDescription:
        "Our artificial intelligence services leverage advanced algorithms and machine learning to automate processes, enhance decision-making, and drive innovation. Experience the future of technology with our AI expertise.",
      imageSrc: "/images/ai-solutions.jpg",
      imageAlt: "Artificial Intelligence",
    },
    {
      title: "Geospatial Science",
      description: "Unlocking insights with advanced geospatial analysis.",
      fullDescription:
        "Our geospatial science services provide precise mapping, spatial analysis, and data visualization to support informed decision-making. Harness the power of GEOINT with our scientists and analysts.",
      imageSrc: "/images/geospatial.jpg",
      imageAlt: "Geospatial Science",
    },
    {
      title: "IT Support",
      description: "Reliable IT support to keep your business running smoothly.",
      fullDescription:
        "Our IT support services offer comprehensive solutions for all your technology needs. From troubleshooting to system maintenance, we ensure your IT infrastructure is secure and efficient.",
      imageSrc: "/images/it-support.jpg",
      imageAlt: "IT Support",
    },
    {
      title: "Data Analytics",
      description: "Turning data into actionable insights.",
      fullDescription:
        "Our data analytics services help you make sense of complex data sets. We provide in-depth analysis, reporting, and visualization to drive strategic decisions and business growth.",
      imageSrc: "/images/data-analytics.jpg",
      imageAlt: "Data Analytics",
    },
    {
      title: "Corporate Support",
      description: "Empowering your business with expert corporate support.",
      fullDescription:
        "Our corporate support services offer administrative, financial, and operational assistance to streamline your business processes. Focus on your core activities while we handle the rest.",
      imageSrc: "/images/corporate-support.jpg",
      imageAlt: "Corporate Support",
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center">
        <div className="absolute inset-0 bg-dark-900">
          <div className="absolute inset-0 bg-gradient-to-r from-dark-900/90 to-dark-900/70" />
          {/* Background image placeholder - add actual image */}
          <div className="absolute inset-0 bg-[url('/images/hero-soldier.jpg')] bg-cover bg-center opacity-30" />
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
            <div className="relative h-96 lg:h-[500px]">
              {/* Veteran memorial image placeholder */}
              <div className="absolute inset-0 bg-gray-300 rounded-lg">
                <div className="absolute inset-0 bg-[url('/images/veteran-memorial.jpg')] bg-cover bg-center rounded-lg" />
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
              <div className="relative h-96 rounded-lg overflow-hidden">
                {/* Capitol building image placeholder */}
                <div className="absolute inset-0 bg-gray-700">
                  <div className="absolute inset-0 bg-[url('/images/capitol-building.jpg')] bg-cover bg-center" />
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

