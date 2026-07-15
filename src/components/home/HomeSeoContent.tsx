"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import Container from "../Container";

const faqs = [
  {
    question: "Can I book a resort for a large group or corporate event?",
    answer: "Yes, you can book resorts for large groups. We offer special group booking discounts and can help coordinate with the property for your specific event needs."
  },
  {
    question: "What are the advantages of booking hotels with us?",
    answer: "We offer the best price guarantee, a wide selection of premium hotels and resorts, 24/7 customer support, and exclusive seasonal discounts. Our platform ensures a seamless and secure booking experience."
  },
  {
    question: "Do I need to create an account to book a hotel?",
    answer: "While you can browse properties as a guest, creating an account allows you to manage your bookings easily, earn rewards, and access exclusive member-only deals."
  },
  {
    question: "Does booking online cost me more?",
    answer: "No, booking online through our platform often costs less! We negotiate directly with properties to bring you exclusive deals and discounted rates you won't find offline."
  },
  {
    question: "How can I get discounts on my hotel booking?",
    answer: "You can apply coupon codes during checkout, check our 'Offers' section for seasonal deals, and subscribe to our newsletter for exclusive discounts straight to your inbox."
  }
];

const HomeSeoContent = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    if (openFaq === index) {
      setOpenFaq(null);
    } else {
      setOpenFaq(index);
    }
  };

  return (
    <div className="w-full py-12 mt-10 bg-white border-t border-neutral-200 text-neutral-600">
      <Container>
        <div className="flex flex-col gap-8 max-w-5xl mx-auto">
          {/* Main Intro */}
          <div>
            <h1 className="text-2xl font-bold text-neutral-900 mb-4">India's Leading Online Hotel and Resort Booking Platform</h1>
            <p className="text-sm mb-4 leading-relaxed">
              We are India's premier hotel and resort booking platform, offering a seamless online ticket booking experience for millions of travelers. Whether you're planning a weekend getaway or a long vacation, we provide access to the best properties across the country.
            </p>
            <p className="text-sm leading-relaxed">
              With thousands of top-rated hotels, luxury resorts, and budget stays, you can easily find the perfect accommodation for your destination. Check the best prices with exclusive discounts and offers when booking your stay with us.
            </p>
          </div>

          {/* Why Choose Us */}
          <div>
            <h2 className="text-xl font-bold text-neutral-900 mb-4">Why Choose Us for Hotel Booking?</h2>
            <p className="text-sm mb-4">Below are some reasons to choose our platform for booking hotels and resorts.</p>
            <ul className="list-disc pl-5 flex flex-col gap-3 text-sm">
              <li><strong>Free Cancellation</strong> - Cancel your bookings without paying cancellation charges on eligible properties.</li>
              <li><strong>Flexible Dates</strong> - Modify your travel dates easily before your scheduled check-in.</li>
              <li><strong>Earn Rewards</strong> - Refer your friends and earn rewards in your wallet after they complete their first stay.</li>
              <li><strong>Premium Properties</strong> - Select from top-rated hotels and luxury resorts that offer premium services and world-class amenities.</li>
              <li><strong>24/7 Customer Support</strong> - Receive 24/7 customer service for any assistance related to your bookings.</li>
              <li><strong>Instant Refund</strong> - Get an instant refund for cancellations or booking-related issues.</li>
            </ul>
          </div>

          {/* How to Book */}
          <div>
            <h2 className="text-xl font-bold text-neutral-900 mb-4">How to Book Hotels and Resorts Online?</h2>
            <p className="text-sm mb-4">Below are some simple steps that you can follow when booking hotels or resorts online.</p>
            <ul className="list-disc pl-5 flex flex-col gap-2 text-sm">
              <li><strong>Step 1:</strong> Visit our website and enter your destination.</li>
              <li><strong>Step 2:</strong> Select your preferred check-in and check-out dates.</li>
              <li><strong>Step 3:</strong> Browse through the list of available hotels and resorts. Use filters to narrow down your choices.</li>
              <li><strong>Step 4:</strong> Select the property that best fits your needs and budget.</li>
              <li><strong>Step 5:</strong> Choose your room type and enter guest details.</li>
              <li><strong>Step 6:</strong> Proceed to payment using our secure checkout process.</li>
              <li><strong>Step 7:</strong> Receive instant confirmation of your booking via email and SMS.</li>
            </ul>
          </div>

          {/* Exclusive Offers */}
          <div>
            <h2 className="text-xl font-bold text-neutral-900 mb-4">Exclusive Offers on Hotels and Resorts</h2>
            <p className="text-sm leading-relaxed">
              We provide exclusive offers and deals on hotel and resort bookings for all travelers. Check our platform regularly for festive offers, seasonal discounts, and special bank deals. All you need to do is apply the relevant coupon code during checkout to avail the discount. We keep adding new discounts depending on seasonality, festivals, and other events to ensure you always get the best price.
            </p>
          </div>

          {/* FAQs */}
          <div className="mt-4">
            <h2 className="text-2xl font-bold text-neutral-900 mb-6">FAQs related to Hotel & Resort Booking</h2>
            
            <div className="flex gap-6 border-b border-neutral-200 mb-6 overflow-x-auto custom-scrollbar pb-1">
              <span className="pb-2 border-b-2 border-rose-500 text-rose-500 font-semibold text-sm cursor-pointer whitespace-nowrap">General</span>
              <span className="pb-2 text-neutral-500 font-semibold text-sm cursor-pointer hover:text-neutral-800 whitespace-nowrap">Booking-related</span>
              <span className="pb-2 text-neutral-500 font-semibold text-sm cursor-pointer hover:text-neutral-800 whitespace-nowrap">Payment</span>
              <span className="pb-2 text-neutral-500 font-semibold text-sm cursor-pointer hover:text-neutral-800 whitespace-nowrap">Cancellation & Refund</span>
            </div>

            <div className="flex flex-col border-t border-neutral-200">
              {faqs.map((faq, index) => (
                <div key={index} className="border-b border-neutral-200">
                  <button 
                    onClick={() => toggleFaq(index)}
                    className="w-full py-4 flex justify-between items-center text-left hover:bg-neutral-50/50 transition focus:outline-none"
                  >
                    <span className="font-medium text-neutral-800">{faq.question}</span>
                    <span className="ml-4 flex-shrink-0">
                      {openFaq === index ? (
                        <ChevronUp className="text-neutral-500" size={20} />
                      ) : (
                        <ChevronDown className="text-neutral-500" size={20} />
                      )}
                    </span>
                  </button>
                  {openFaq === index && (
                    <div className="pb-4 text-sm text-neutral-600 leading-relaxed pr-8">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
        </div>
      </Container>
    </div>
  );
};

export default HomeSeoContent;
