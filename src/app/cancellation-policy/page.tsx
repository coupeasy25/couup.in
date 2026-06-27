import Container from "@/components/Container";

const CancellationPolicyPage = () => {
  return (
    <div className="pt-28 pb-20">
      <Container>
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl border border-neutral-200">
          <h1 className="text-3xl font-bold mb-8">Cancellation & Refund Policy</h1>
          
          <div className="space-y-6 text-neutral-600 leading-relaxed">
            <p className="font-semibold text-neutral-800">At Couup, we strive to make the cancellation and refund process as smooth as possible.</p>
            
            <div>
              <h2 className="text-xl font-bold text-neutral-800 mb-2">1. Cancellation Rules</h2>
              <p>Cancellations are subject to the specific policy chosen by the Host at the time of your booking. Please review these rules before confirming your reservation.</p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-neutral-800 mb-2">2. Refund Processing</h2>
              <p>If you are eligible for a refund due to a cancellation or booking issue, the refund will be initiated directly by the Couup administration.</p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-neutral-800 mb-2">3. Processing Time</h2>
              <p>Once a refund is approved and initiated, the amount will be credited back to your original payment method (processed securely via Razorpay) within <strong>2 to 3 working days</strong>. Please note that your bank or credit card provider may take additional time to reflect the amount in your account.</p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-neutral-800 mb-2">4. Disputes</h2>
              <p>If you face any issues with a property or need to request a refund outside the standard cancellation window, please contact Couup Support. Our team will review the case and mediate with the Host to ensure a fair resolution.</p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default CancellationPolicyPage;
