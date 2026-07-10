"use client";

import { useState } from "react";
import Container from "@/components/Container";
import { ChevronDown, Mail, Phone, LifeBuoy, FileText } from "lucide-react";

interface HelpClientProps {
  currentUser?: any | null;
}

const FAQS = [
  {
    question: "How do I cancel my booking?",
    answer: "To cancel a booking, go to your 'Trips' page from the profile menu. Select the upcoming trip you want to cancel, and click the red 'Cancel Booking' button at the bottom of the payment summary. Please note that cancellation policies and penalties may apply depending on how close you are to the check-in date."
  },
  {
    question: "What is the refund policy?",
    answer: "Refunds are processed automatically when you cancel a booking. If you cancel well in advance, you typically receive a full refund. If you cancel close to the check-in date, a penalty percentage may be deducted as per the property's specific cancellation rules. Refunds usually take 5-7 business days to reflect in your account."
  },
  {
    question: "How do I become a Host on Couup?",
    answer: "Becoming a host is easy! Simply click on your profile menu and select 'Become a host' or 'Couup a new property'. We will guide you through a simple step-by-step process to list your property, add photos, set pricing, and start accepting guests."
  },
  {
    question: "Can I change my check-in time?",
    answer: "Check-in times are set by the property host (usually 2:00 PM). If you need an early check-in or late check-out, please contact the host directly after booking by viewing the property details. Early check-ins are subject to availability and the host's approval."
  },
  {
    question: "How do I edit my profile information?",
    answer: "You can edit your Name, Age, Mobile Number, and Email by opening the user dropdown menu and clicking on 'Personal Information'. Don't forget to click 'Save Changes' at the bottom of the page once you are done!"
  }
];

const HelpClient: React.FC<HelpClientProps> = ({ currentUser }) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-white pb-24 pt-28">
      <Container>
        <div className="max-w-3xl mx-auto flex flex-col gap-16">
          
          {/* Header */}
          <div className="flex flex-col gap-4 text-center items-center mt-4">
            <div className="w-16 h-16 bg-[#F97316]/10 rounded-full flex items-center justify-center mb-2">
              <LifeBuoy size={32} className="text-[#F97316] stroke-[2]" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 tracking-tight">
              How can we help{currentUser?.name ? `, ${currentUser.name.split(' ')[0]}` : ''}?
            </h1>
            <p className="text-neutral-500 text-lg max-w-lg">
              Find answers to common questions or reach out to our support team directly.
            </p>
          </div>

          {/* Contact Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <a href="mailto:support@couup.com" className="group p-6 rounded-3xl border border-neutral-200 hover:border-[#F97316] hover:shadow-md transition-all flex items-start gap-5 cursor-pointer">
              <div className="w-12 h-12 rounded-full bg-neutral-50 group-hover:bg-[#F97316]/10 flex items-center justify-center shrink-0 transition-colors">
                <Mail size={24} className="text-neutral-600 group-hover:text-[#F97316] transition-colors" />
              </div>
              <div className="flex flex-col pt-1">
                <span className="font-bold text-neutral-900 text-lg mb-1 group-hover:text-[#F97316] transition-colors">Email Support</span>
                <span className="text-neutral-500 text-sm mb-2">Drop us a line anytime. We usually reply within 24 hours.</span>
                <span className="font-semibold text-neutral-900">support@couup.com</span>
              </div>
            </a>

            <a href="tel:+919876543210" className="group p-6 rounded-3xl border border-neutral-200 hover:border-[#F97316] hover:shadow-md transition-all flex items-start gap-5 cursor-pointer">
              <div className="w-12 h-12 rounded-full bg-neutral-50 group-hover:bg-[#F97316]/10 flex items-center justify-center shrink-0 transition-colors">
                <Phone size={24} className="text-neutral-600 group-hover:text-[#F97316] transition-colors" />
              </div>
              <div className="flex flex-col pt-1">
                <span className="font-bold text-neutral-900 text-lg mb-1 group-hover:text-[#F97316] transition-colors">Phone Support</span>
                <span className="text-neutral-500 text-sm mb-2">Call us for urgent booking issues or emergencies.</span>
                <span className="font-semibold text-neutral-900">+91 98765 43210</span>
              </div>
            </a>
          </div>

          {/* FAQs */}
          <div className="flex flex-col gap-6">
            <h2 className="text-2xl font-bold text-neutral-900 flex items-center gap-2 mb-2">
              <FileText size={24} className="text-[#F97316]" />
              Frequently Asked Questions
            </h2>

            <div className="flex flex-col divide-y divide-neutral-100 border-t border-b border-neutral-100">
              {FAQS.map((faq, index) => {
                const isOpen = openFaqIndex === index;
                return (
                  <div key={index} className="py-2">
                    <button 
                      onClick={() => toggleFaq(index)}
                      className="w-full flex justify-between items-center py-4 text-left focus:outline-none group"
                    >
                      <span className={`font-semibold text-lg transition-colors ${isOpen ? 'text-[#F97316]' : 'text-neutral-800 group-hover:text-[#F97316]'}`}>
                        {faq.question}
                      </span>
                      <ChevronDown 
                        size={20} 
                        className={`text-neutral-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#F97316]' : 'group-hover:text-[#F97316]'}`} 
                      />
                    </button>
                    <div 
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100 mb-6' : 'max-h-0 opacity-0'}`}
                    >
                      <p className="text-neutral-600 leading-relaxed pr-8">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </Container>
    </div>
  );
};

export default HelpClient;
