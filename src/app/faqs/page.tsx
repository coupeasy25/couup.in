"use client";

import Container from "@/components/Container";
import { useState } from "react";

const FAQsPage = () => {
  const faqs = [
    { 
      title: 'Booking a place', 
      answer: 'To book a place, simply search for your destination, select your dates, and click "Book Now" on the listing page. Follow the prompts to complete your payment securely.' 
    },
    { 
      title: 'Payments & Pricing', 
      answer: 'We accept all major credit cards, debit cards, and popular UPI apps. The total price you see includes the base nightly rate and all applicable taxes or cleaning fees.' 
    },
    { 
      title: 'Cancellations & Refunds', 
      answer: "You can cancel your booking directly from the 'Trips' section in your profile. Refund amounts are processed automatically based on the host's specific cancellation policy." 
    },
    { 
      title: 'Your Account', 
      answer: 'You can manage your personal details, passwords, and notification preferences by going to Profile > Personal information.' 
    },
    { 
      title: 'Safety concerns', 
      answer: 'Your safety is our top priority. If you feel unsafe or experience any emergency issues during your stay, please contact our 24/7 support line immediately.' 
    },
    { 
      title: 'Hosting on Couup', 
      answer: 'Becoming a host is easy! Simply navigate to the "Host Dashboard" from your profile and click "List your space" to start earning money from your property.' 
    },
  ];

  return (
    <div className="pt-28 pb-20">
      <Container>
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl border border-neutral-200">
          <h1 className="text-3xl font-bold mb-8">Frequently Asked Questions</h1>
          
          <div className="space-y-6 text-neutral-600 leading-relaxed">
            {faqs.map((faq, index) => (
              <div key={index}>
                <h2 className="text-xl font-bold text-neutral-800 mb-2">{faq.title}</h2>
                <p>{faq.answer}</p>
              </div>
            ))}
            
            <div className="mt-8 pt-8 border-t border-neutral-200">
              <h2 className="text-xl font-bold text-neutral-800 mb-2">Need more help?</h2>
              <p>If you couldn't find the answer to your question, please feel free to <a href="/contact" className="text-rose-500 hover:underline">contact our support team</a>.</p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default FAQsPage;
