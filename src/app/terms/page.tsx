import Container from "@/components/Container";

const TermsPage = () => {
  return (
    <div className="pt-28 pb-20">
      <Container>
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl border border-neutral-200">
          <h1 className="text-3xl font-bold mb-8">Terms and Conditions</h1>
          
          <div className="space-y-6 text-neutral-600 leading-relaxed">
            <p className="font-semibold text-neutral-800">Welcome to Couup! By accessing or using the Couup mobile application and website, you agree to comply with and be bound by the following Terms and Conditions. Please read them carefully.</p>
            
            <div>
              <h2 className="text-xl font-bold text-neutral-800 mb-2">1. The Couup Platform</h2>
              <p>Couup is a digital marketplace that connects Guests seeking accommodations with Hosts offering properties. Couup provides the technology to facilitate these connections, including search, wishlists, and secure payment processing. Couup itself does not own, operate, or manage any of the properties listed.</p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-neutral-800 mb-2">2. User Accounts & Verification</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Registration:</strong> You must provide accurate information to register. Admins reserve the right to verify, suspend, or terminate accounts that violate our policies.</li>
                <li><strong>Account Types:</strong> A single account can act as a "Guest" to book properties or upgrade to a "Host" to list properties.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold text-neutral-800 mb-2">3. Bookings, Payments & Razorpay</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Direct Contracting:</strong> When a Guest books a property, they enter into a direct agreement with the Host.</li>
                <li><strong>Payments:</strong> All payments are processed securely through our third-party payment partner, Razorpay. By making a payment, you agree to Razorpay's terms of service.</li>
                <li><strong>Pricing:</strong> The total price displayed at checkout includes the property rate and any applicable Couup service fees.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold text-neutral-800 mb-2">4. Hosting on Couup (Host Dashboard)</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Listing Accuracy:</strong> Hosts are strictly responsible for the accuracy of their listings, including images, prices, and amenities.</li>
                <li><strong>Reservation Management:</strong> Hosts must manage their bookings via the "Host Dashboard." Canceling confirmed bookings without a valid reason may result in penalties or account suspension.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold text-neutral-800 mb-2">5. Favorites & App Features</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Wishlists:</strong> Guests can save properties to their "Wishlist." Pricing and availability of favorited items are subject to change by the Host.</li>
                <li><strong>Dynamic Content:</strong> App content such as "Explore Destinations" and promotional Banners are managed by Couup Administration and are subject to change without notice.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold text-neutral-800 mb-2">6. Admin Notifications & Communications</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Broadcast Messages:</strong> Couup Administration may send global notifications (alerts, offers, updates) directly to your mobile app inbox.</li>
                <li>By using the app, you consent to receive these in-app notifications. You can view past alerts in the "Notifications" screen via the bell icon.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold text-neutral-800 mb-2">7. Cancellations and Refunds</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>Refunds for canceled bookings are strictly governed by the specific cancellation policy set by the Host at the time of booking.</li>
                <li>In case of payment failures or disputes via Razorpay, Couup will assist in mediation, but final settlement depends on banking partners and Host policies.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold text-neutral-800 mb-2">8. Prohibited Conduct</h2>
              <p className="mb-2">Users agree NOT to:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Bypass the Couup payment system.</li>
                <li>Post fake reviews or misleading property photos.</li>
                <li>Use the app for any fraudulent activities.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold text-neutral-800 mb-2">9. Modifications to the App</h2>
              <p>Couup reserves the right to modify, suspend, or discontinue any feature of the app at any time without prior liability.</p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default TermsPage;
