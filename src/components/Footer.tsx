"use client";

import Link from "next/link";


const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral-900 text-neutral-300 w-full pt-16 pb-8 border-t border-neutral-800">
      <div className="max-w-[2520px] mx-auto xl:px-20 md:px-10 sm:px-2 px-4">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Column 1: Brand Details */}
          <div className="flex flex-col gap-6">
            <Link href="/" className="inline-block">
              <span className="font-extrabold text-3xl tracking-tight text-white">Couup</span>
            </Link>
            <p className="text-sm leading-relaxed text-neutral-400">
              Discover unparalleled luxury and unforgettable stays. We bring you the finest collection of hotels, resorts, and vacation rentals tailored for your perfect getaway.
            </p>
            <div className="flex items-center gap-4 mt-2">
              <a href="#" aria-label="Facebook" className="hover:text-white transition bg-neutral-800 p-2.5 rounded-full hover:bg-neutral-700">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <a href="#" aria-label="Instagram" className="hover:text-white transition bg-neutral-800 p-2.5 rounded-full hover:bg-neutral-700">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </a>
              <a href="#" aria-label="Twitter" className="hover:text-white transition bg-neutral-800 p-2.5 rounded-full hover:bg-neutral-700">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
              </a>
            </div>
          </div>

          {/* Column 2: Top Destinations */}
          <div className="flex flex-col gap-6">
            <h3 className="text-white font-semibold tracking-wide uppercase text-sm">Top Destinations</h3>
            <nav>
              <ul className="flex flex-col gap-3 text-sm">
                <li><Link href="/?locationValue=Goa" className="hover:text-white transition hover:underline">Hotels in Goa</Link></li>
                <li><Link href="/?locationValue=Udaipur" className="hover:text-white transition hover:underline">Resorts in Udaipur</Link></li>
                <li><Link href="/?locationValue=Mumbai" className="hover:text-white transition hover:underline">Weekend Getaways near Mumbai</Link></li>
                <li><Link href="/?locationValue=Manali" className="hover:text-white transition hover:underline">Villas in Manali</Link></li>
                <li><Link href="/?locationValue=Kerala" className="hover:text-white transition hover:underline">Houseboats in Kerala</Link></li>
              </ul>
            </nav>
          </div>

          {/* Column 3: Categories */}
          <div className="flex flex-col gap-6">
            <h3 className="text-white font-semibold tracking-wide uppercase text-sm">Categories</h3>
            <nav>
              <ul className="flex flex-col gap-3 text-sm">
                <li><Link href="/?category=Luxury+Resorts" className="hover:text-white transition hover:underline">Luxury Resorts</Link></li>
                <li><Link href="/?category=Couple+Friendly" className="hover:text-white transition hover:underline">Couple Friendly Hotels</Link></li>
                <li><Link href="/?category=Private+Pool" className="hover:text-white transition hover:underline">Villas with Private Pool</Link></li>
                <li><Link href="/?category=Budget+Stays" className="hover:text-white transition hover:underline">Budget Stays</Link></li>
                <li><Link href="/?category=Pet+Friendly" className="hover:text-white transition hover:underline">Pet Friendly Properties</Link></li>
              </ul>
            </nav>
          </div>

          {/* Column 4: Support & Legal */}
          <div className="flex flex-col gap-6">
            <h3 className="text-white font-semibold tracking-wide uppercase text-sm">Support & Legal</h3>
            <nav>
              <ul className="flex flex-col gap-3 text-sm">
                <li><Link href="/about" className="hover:text-white transition hover:underline">About Us</Link></li>
                <li><Link href="/contact" className="hover:text-white transition hover:underline">Contact Us</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition hover:underline">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition hover:underline">Terms & Conditions</Link></li>
                <li><Link href="/cancellation-policy" className="hover:text-white transition hover:underline">Cancellation Policy</Link></li>
                <li><Link href="/cookie-policy" className="hover:text-white transition hover:underline">Cookie Policy</Link></li>
                <li><Link href="/faqs" className="hover:text-white transition hover:underline">FAQs</Link></li>
                <li className="mt-2">
                  <Link href="/become-a-host" className="inline-block text-[#FFFFFF] font-semibold border border-[#FFFFFF] px-4 py-2 rounded-lg hover:bg-[#FFFFFF] hover:text-neutral-900 transition duration-300">
                    Partner With Us
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-neutral-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-neutral-500">
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
