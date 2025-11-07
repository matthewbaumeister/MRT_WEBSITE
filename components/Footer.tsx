import Link from "next/link";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="bg-dark-900 text-white pt-12 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Logo and Contact */}
          <div>
            <div className="mb-4">
              <Image
                src="/images/logo.png"
                alt="Make Ready Logo"
                width={140}
                height={42}
                className="object-contain"
              />
            </div>
            <div className="space-y-2 text-gray-300">
              <p>
                <a
                  href="mailto:info@make-ready-consulting.com"
                  className="hover:text-accent-400 transition-colors"
                >
                  info@make-ready-consulting.com
                </a>
              </p>
              <p>9409 B Battle Street</p>
              <p>Manassas, VA 20110</p>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-gray-300 hover:text-accent-400 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gray-300 hover:text-accent-400 transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="text-gray-300 hover:text-accent-400 transition-colors"
                >
                  Services
                </Link>
              </li>
            </ul>
          </div>

          {/* Certifications */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              Small Business Certifications
            </h3>
            <ul className="space-y-2 text-gray-300">
              <li>Veteran Owned</li>
              <li>Service Disabled Veteran Owned Small Business</li>
              <li>Native American Owned</li>
            </ul>
          </div>
        </div>

        {/* Legal Links */}
        <div className="border-t border-gray-700 pt-6 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-400">
          <div className="mb-4 sm:mb-0">
            <p>&copy; {new Date().getFullYear()} Make Ready Consulting. All rights reserved.</p>
          </div>
          <div className="flex space-x-6">
            <Link
              href="/terms"
              className="hover:text-accent-400 transition-colors"
            >
              Terms & Conditions
            </Link>
            <Link
              href="/privacy"
              className="hover:text-accent-400 transition-colors"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

