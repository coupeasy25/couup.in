import Container from "@/components/Container";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with COUUP's 24/7 support team for assistance with bookings or partnering with us.",
};

const ContactPage = () => {
  return (
    <div className="pt-28 pb-20">
      <Container>
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl border border-neutral-200">
          <h1 className="text-3xl font-bold mb-8">Contact Us</h1>
          
          <div className="space-y-6 text-neutral-600 leading-relaxed">
            <p className="text-lg">
              We're here to help! Whether you have a question about a booking, need assistance hosting your property, or just want to share feedback, our 24/7 support team is ready to assist you.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
              <div className="bg-neutral-50 p-6 rounded-lg border border-neutral-100">
                <h2 className="text-xl font-bold text-neutral-800 mb-2">Customer Support</h2>
                <p className="mb-4">For immediate assistance with bookings, payments, or urgent issues during your stay.</p>
                <p className="font-semibold text-neutral-800">Email: support@couup.com</p>
                <p className="font-semibold text-neutral-800">Phone: 1800-COUUP-HELP</p>
              </div>

              <div className="bg-neutral-50 p-6 rounded-lg border border-neutral-100">
                <h2 className="text-xl font-bold text-neutral-800 mb-2">Partner With Us</h2>
                <p className="mb-4">Are you a property owner looking to list your space on Couup? Connect with our onboarding team.</p>
                <p className="font-semibold text-neutral-800">Email: hosts@couup.com</p>
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-xl font-bold text-neutral-800 mb-4">Send us a message</h2>
              <form className="space-y-4">
                <div className="flex flex-col gap-2">
                  <label htmlFor="name" className="text-sm font-semibold text-neutral-800">Name</label>
                  <input type="text" id="name" className="p-3 border border-neutral-300 rounded-md outline-none focus:border-rose-500" placeholder="Your full name" />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="email" className="text-sm font-semibold text-neutral-800">Email</label>
                  <input type="email" id="email" className="p-3 border border-neutral-300 rounded-md outline-none focus:border-rose-500" placeholder="your.email@example.com" />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="message" className="text-sm font-semibold text-neutral-800">Message</label>
                  <textarea id="message" rows={5} className="p-3 border border-neutral-300 rounded-md outline-none focus:border-rose-500" placeholder="How can we help you?"></textarea>
                </div>
                <button type="button" className="bg-rose-500 text-white font-semibold py-3 px-6 rounded-md hover:bg-rose-600 transition w-full md:w-auto">
                  Submit Request
                </button>
              </form>
            </div>
            
          </div>
        </div>
      </Container>
    </div>
  );
};

export default ContactPage;
