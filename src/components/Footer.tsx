"use client";

import Link from "next/link";

interface FooterProps {
  amenities?: any[];
  destinations?: any[];
}

const Footer: React.FC<FooterProps> = ({ amenities = [], destinations = [] }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral-50 text-neutral-600 w-full pt-16 pb-8 border-t border-neutral-200">
      <div className="max-w-[2520px] mx-auto xl:px-20 md:px-10 sm:px-2 px-4">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Column 1: Brand Details */}
          <div className="flex flex-col gap-6">
            <Link href="/" className="inline-block">
              <span className="font-extrabold text-3xl tracking-tight text-neutral-900">Couup</span>
            </Link>
            <p className="text-sm leading-relaxed text-neutral-500">
              Discover unparalleled luxury and unforgettable stays. We bring you the finest collection of hotels, resorts, and vacation rentals tailored for your perfect getaway.
            </p>
            <div className="flex items-center gap-4 mt-2">
              <a href="https://www.instagram.com/couup.in/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-neutral-900 transition bg-neutral-200 p-2.5 rounded-full hover:bg-neutral-300">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </a>
            </div>
          </div>

          {/* Column 2: Top Destinations */}
          <div className="flex flex-col gap-6">
            <h3 className="text-neutral-900 font-semibold tracking-wide uppercase text-sm">Top Destinations</h3>
            <nav>
              <ul className="flex flex-col gap-3 text-sm">
                {destinations.slice(0, 5).map((dest) => (
                  <li key={dest._id}>
                    <Link href={`/?locationValue=${encodeURIComponent(dest.name)}`} className="hover:text-neutral-900 transition hover:underline">
                      Stays in {dest.name}
                    </Link>
                  </li>
                ))}
                {destinations.length === 0 && (
                  <li className="text-neutral-500">No destinations available.</li>
                )}
              </ul>
            </nav>
          </div>

          {/* Column 3: Categories */}
          <div className="flex flex-col gap-6">
            <h3 className="text-neutral-900 font-semibold tracking-wide uppercase text-sm">Categories</h3>
            <nav>
              <ul className="flex flex-col gap-3 text-sm">
                {amenities.slice(0, 5).map((amenity) => (
                  <li key={amenity._id}>
                    <Link href={`/?category=${encodeURIComponent(amenity.name)}`} className="hover:text-neutral-900 transition hover:underline">
                      {amenity.name}
                    </Link>
                  </li>
                ))}
                {amenities.length === 0 && (
                  <li className="text-neutral-500">No categories available.</li>
                )}
              </ul>
            </nav>
          </div>

          {/* Column 4: Support & Legal */}
          <div className="flex flex-col gap-6">
            <h3 className="text-neutral-900 font-semibold tracking-wide uppercase text-sm">Support & Legal</h3>
            <nav>
              <ul className="flex flex-col gap-3 text-sm">
                <li><Link href="/about" className="hover:text-neutral-900 transition hover:underline">About Us</Link></li>
                <li><Link href="/contact" className="hover:text-neutral-900 transition hover:underline">Contact Us</Link></li>
                <li><Link href="/privacy" className="hover:text-neutral-900 transition hover:underline">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-neutral-900 transition hover:underline">Terms & Conditions</Link></li>
                <li><Link href="/cancellation-policy" className="hover:text-neutral-900 transition hover:underline">Cancellation Policy</Link></li>
                <li><Link href="/cookie-policy" className="hover:text-neutral-900 transition hover:underline">Cookie Policy</Link></li>
                <li><Link href="/faqs" className="hover:text-neutral-900 transition hover:underline">FAQs</Link></li>
                <li className="mt-2">
                  <Link href="/become-a-host" className="inline-block text-neutral-900 font-semibold border border-neutral-900 px-4 py-2 rounded-lg hover:bg-neutral-900 hover:text-white transition duration-300">
                    Partner With Us
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-neutral-200 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-neutral-500">
          <p>© {currentYear} Couup. All rights reserved.</p>
          <div className="flex gap-4">
            <span>Secured with SSL</span>
            <span>24/7 Support</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
