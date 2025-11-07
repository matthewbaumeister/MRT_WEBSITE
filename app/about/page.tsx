import Image from "next/image";
import Card from "@/components/ui/Card";

export const metadata = {
  title: "About Us - Make Ready Consulting",
  description:
    "Learn about Make Ready Consulting's mission and meet our experienced leadership team of defense and intelligence community professionals.",
};

export default function AboutPage() {
  const teamMembers = [
    {
      name: "Bryan Snow",
      title: "CEO",
      image: "/images/team/bryan-snow.jpg",
      bio: "With over 15 years of experience in the DoD and IC intelligence community, Bryan excels in aligning best-in-class capabilities with the USG's toughest mission needs. Specializing in technical program management, capture management, and proposal development, he brings expertise in data science, geospatial technologies, and AI to help companies win contracts in the DoD and IC. As the founder of Make Ready, Bryan has led successful capture efforts for multiple clients, delivering results in a highly competitive market.",
      branch: "Proud USMC Veteran.",
      education: [
        "Bachelor of Science, Business Administration, Colorado Technical Institute",
        "Masters of Science, Technology Management, Georgetown University",
      ],
    },
    {
      name: "Matt Baumeister",
      title: "Director of Growth",
      image: "/images/team/matt-baumeister.jpg",
      bio: "Matt is a AI/ML and geospatial veteran with advanced doctoral studies in business and AI. He brings a wealth of AI/ML product experience and leverages AI and data-driven strategies to drive growth, operational efficiency, and strategic partnerships.",
      branch: "Proud US Army Veteran.",
      education: [
        "Bachelor of Science, Mathematics and Computer Science, The United States Military Academy at West Point",
        "Masters of Business Administration, Liberty University",
        "Doctoral Candidate, Doctorate of Business Administration, Doctorate of Strategic Leadership, Liberty University",
      ],
    },
    {
      name: "Adam Ashurst",
      title: "Director of Strategy",
      image: "/images/team/adam-ashurst.jpg",
      bio: "Adam is a Defense and Intelligence Community industry expert with over 25 years of experience. Specializing in strategic planning, program management and customer relations, he brings expertise in requirements generations, DoD acquisition and geospatial-intelligence. Over his career, he has led several Departmental efforts leading to a major system acquisition decision satisfying critical mission needs.",
      branch: "Proud US Army Veteran.",
      education: [
        "Bachelor of Integrative Studies - Business Communication, George Mason University",
        "Business Administration and Management, General, Certificate in Business Strategy, University of Virginia",
      ],
    },
    {
      name: "Bryan Minor",
      title: "Lead AI/ML Strategist",
      image: "/images/team/bryan-minor.jpg",
      bio: "Bryan is an industry leading AI startup entrepreneur with extensive experience in developing cutting-edge AI solutions and leading technical teams. Over his career, he has founded several startups and collaborated with both commercial and government clients, driving AI innovation across industries.",
      branch: "Proud USAF Veteran.",
      education: [
        "Bachelor of Science, Physics, Central Washington University",
        "Master's Degree, Nuclear Science, U.S. Air Force Institute of Technology",
        "Doctor of Philosophy (Ph.D.), Physics, U.S. Air Force Institute of Technology",
      ],
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-dark-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">About Us</h1>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
              OUR MISSION
            </h2>
            <p className="text-xl text-gray-700 mb-6 leading-relaxed">
              Enabling the United States Government from the sustainment and
              improving infrastructure into the modern age to capability
              development and delivery that affect the most exquisite
              intelligence, operations, and weapon systems.
            </p>
            <p className="text-xl text-gray-700 leading-relaxed">
              We are committed to building strong partnerships with our customers
              and delivering sustainable value through our solutions and
              consulting services.
            </p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              OUR TEAM
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Led by experienced professionals with deep expertise in defense,
              intelligence, and technology.
            </p>
          </div>

          <div className="space-y-16">
            {teamMembers.map((member, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
                  <div className="relative h-80 lg:h-auto">
                    {/* Placeholder for team member photo */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center">
                      <div className="text-white text-center">
                        <div className="w-32 h-32 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
                          <span className="text-4xl font-bold">
                            {member.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="lg:col-span-2 p-8">
                    <h3 className="text-3xl font-bold text-gray-900 mb-2">
                      {member.name}
                    </h3>
                    <p className="text-xl text-primary-600 font-semibold mb-4">
                      {member.title}
                    </p>
                    <p className="text-gray-700 mb-4 leading-relaxed">
                      {member.bio}
                    </p>
                    <p className="text-gray-800 font-semibold mb-4 italic">
                      {member.branch}
                    </p>
                    <div>
                      <h4 className="text-lg font-bold text-gray-900 mb-2">
                        Education:
                      </h4>
                      <ul className="space-y-1 text-gray-700">
                        {member.education.map((edu, i) => (
                          <li key={i}>{edu}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-12 text-center">
              Our Values
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-primary-600 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Integrity
                </h3>
                <p className="text-gray-600">
                  We operate with the highest ethical standards and transparency
                  in all our dealings.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-primary-600 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Excellence
                </h3>
                <p className="text-gray-600">
                  We deliver exceptional results through expertise, innovation,
                  and dedication.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-primary-600 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Service</h3>
                <p className="text-gray-600">
                  We are committed to serving our nation and supporting those who
                  protect it.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

