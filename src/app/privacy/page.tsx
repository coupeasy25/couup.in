import Container from "@/components/Container";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Read COUUP's privacy policy to understand how we protect your data.",
};

const PrivacyPage = () => {
  return (
    <div className="pt-28 pb-20">
      <Container>
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl border border-neutral-200">
          <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
          
          <div className="space-y-6 text-neutral-600 leading-relaxed">
            <p className="font-semibold text-neutral-800">Welcome to the Couup Privacy Policy. This document outlines how we collect, use, and protect your data when you use our mobile application and web platform.</p>
            
            <div>
              <h2 className="text-xl font-bold text-neutral-800 mb-2">1. Information We Collect</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Account Data:</strong> When you sign up, we collect your Name, Email, Profile Image, and Password (encrypted securely).</li>
                <li><strong>Hosting Data:</strong> If you become a Host, we collect details about your property, pricing, and location.</li>
                <li><strong>Activity Data:</strong> We store your Wishlists, reservation history, and interactions with the app.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold text-neutral-800 mb-2">2. How We Use Your Information</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>To facilitate bookings and communication between Guests and Hosts.</li>
                <li>To send you Admin Broadcasts, such as promotional offers and system alerts via in-app notifications.</li>
                <li>To improve our platform's user experience by tracking popular destinations and search trends.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold text-neutral-800 mb-2">3. Payment Processing</h2>
              <p>Couup uses Razorpay as our secure third-party payment gateway. We do not directly store your credit card, debit card, or UPI details on our servers. All financial transaction data is handled securely by Razorpay.</p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-neutral-800 mb-2">4. Data Sharing & Disclosure</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>With Hosts/Guests:</strong> Necessary information (like your name and booking details) is shared with the Host when you make a reservation.</li>
                <li><strong>With Service Providers:</strong> We share data with trusted tech partners (e.g., Database hosts, Razorpay) strictly to provide our services.</li>
                <li><strong>We NEVER sell your personal data to third-party marketers or advertisers.</strong></li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold text-neutral-800 mb-2">5. Admin Access & Security</h2>
              <p>Couup Administrators have access to user accounts, listings, and booking history for moderation, support, and platform security purposes.</p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-neutral-800 mb-2">6. Your Rights</h2>
              <p>You have the right to request access to your data or ask for your account to be deleted. To do so, please contact us via the Help Center. Note that some data may be retained for legal or accounting purposes.</p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default PrivacyPage;
