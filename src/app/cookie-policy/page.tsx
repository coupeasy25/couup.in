import Container from "@/components/Container";

const CookiePolicyPage = () => {
  return (
    <div className="pt-28 pb-20">
      <Container>
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl border border-neutral-200">
          <h1 className="text-3xl font-bold mb-8">Cookie Policy</h1>
          
          <div className="space-y-6 text-neutral-600 leading-relaxed">
            <p className="font-semibold text-neutral-800">At Couup, we use cookies and similar tracking technologies (like local storage) to improve your experience on our website and mobile app.</p>
            
            <div>
              <h2 className="text-xl font-bold text-neutral-800 mb-2">1. What are Cookies?</h2>
              <p>Cookies are small data files stored on your device that help our app and website remember your preferences and recognize you on future visits.</p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-neutral-800 mb-2">2. How We Use Them</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Essential Cookies:</strong> Required for core functionality, such as keeping you logged in securely and processing payments via Razorpay.</li>
                <li><strong>Performance & Analytics:</strong> Helps us understand how you use Couup, which destinations are popular, and how we can improve our services.</li>
                <li><strong>Personalization:</strong> Remembers your search history and Wishlists so you don't have to start from scratch every time you visit.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold text-neutral-800 mb-2">3. Third-Party Cookies</h2>
              <p>We may allow trusted third-party services (like analytics providers) to use cookies on our platform to help us analyze traffic and deliver a better user experience.</p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-neutral-800 mb-2">4. Managing Preferences</h2>
              <p>You have full control over your data. You can clear your browser cache, manage cookies, or adjust local storage permissions directly from your browser or mobile device settings. Note that disabling certain essential cookies may affect your ability to log in or book properties.</p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default CookiePolicyPage;
