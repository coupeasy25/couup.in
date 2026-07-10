"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";

const OFFERS = [
  {
    id: 1,
    type: "INTL FLIGHTS",
    title: "LIVE NOW: Deals for Students",
    description: "Up to 30% OFF* on International Flights, Hotels & More.",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400&q=80",
    buttonText: "BOOK NOW"
  },
  {
    id: 2,
    type: "DOM HOTELS",
    title: "Book Ramoji Hotels @ Up to 35% OFF*",
    description: "For a Luxurious, Comfortable and Elegant Stay!",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80",
    buttonText: "BOOK NOW"
  },
  {
    id: 4,
    type: "DOM HOTELS",
    title: "FOR UNFORGETTABLE STAYS IN INDIA:",
    description: "Book Amritara Hotels & Resorts @ Up to 40% OFF*",
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400&q=80",
    buttonText: "VIEW DETAILS"
  }
];

const TABS = [
  "All Offers", "Bank Offers", "Flights", "Hotels", "Holidays", "Trains", "Cabs", "Bus", "Forex", "MORE"
];

const OffersList = () => {
  const [activeTab, setActiveTab] = useState("All Offers");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    "name": "COUUP Special Offers",
    "itemListElement": OFFERS.map((offer, index) => ({
      "@type": "Offer",
      "name": offer.title,
      "description": offer.description,
      "url": "https://www.couup.in/offers",
      "priceCurrency": "INR",
      "availability": "https://schema.org/InStock",
      "validFrom": new Date().toISOString()
    }))
  };

  return (
    <div className="w-full bg-white rounded-2xl shadow-sm border border-neutral-200 p-6 mb-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Header section with tabs */}
      <div className="flex flex-row items-center gap-6 border-b border-neutral-200 mb-6 overflow-x-auto custom-scrollbar">
        <h2 className="text-3xl font-extrabold text-neutral-900 pr-4 flex-shrink-0 pb-4">Offers</h2>
        
        <div className="flex flex-row gap-6 flex-1 min-w-max">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-[15px] font-bold pb-4 -mb-[1px] whitespace-nowrap transition-colors ${
                activeTab === tab 
                  ? "text-[#008cff] border-b-[3px] border-[#008cff]" 
                  : "text-neutral-600 hover:text-[#008cff]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="hidden md:flex flex-row items-center gap-4 pl-4 pb-4 flex-shrink-0">
          <button className="text-[#008cff] font-bold text-sm hover:underline tracking-wide">VIEW ALL &rarr;</button>
          <div className="flex flex-row gap-2">
            <button aria-label="Scroll left" className="p-1 rounded-full border border-neutral-300 text-neutral-400 hover:text-[#008cff] hover:border-[#008cff] transition">
              <ChevronLeft size={16} />
            </button>
            <button aria-label="Scroll right" className="p-1 rounded-full border border-neutral-300 text-neutral-400 hover:text-[#008cff] hover:border-[#008cff] transition">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {OFFERS.map((offer) => (
          <div 
            key={offer.id}
            className="flex flex-row gap-4 p-4 rounded-xl border border-neutral-200 bg-white hover:shadow-lg transition duration-300 cursor-pointer group"
          >
            {/* Image */}
            <div className="relative w-32 h-32 rounded-lg overflow-hidden flex-shrink-0">
              <Image 
                src={offer.image}
                alt={offer.title}
                fill
                className="object-cover transition duration-300"
              />
            </div>

            {/* Content */}
            <div className="flex flex-col flex-1 justify-between py-1">
              <div className="flex flex-col gap-1">
                <div className="flex flex-row justify-between items-center">
                  <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wide">{offer.type}</span>
                  <span className="text-[10px] text-neutral-400 font-medium">T&C'S APPLY</span>
                </div>
                <h3 className="text-[17px] font-extrabold text-neutral-900 leading-tight line-clamp-2 mt-1">
                  {offer.title}
                </h3>
                <p className="text-[13px] text-neutral-600 line-clamp-2 mt-1 font-medium">
                  {offer.description}
                </p>
              </div>
              
              <div className="flex justify-end mt-2">
                <span className="text-[#008cff] font-bold text-sm uppercase">
                  {offer.buttonText}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OffersList;
