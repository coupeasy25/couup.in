import Container from "@/components/Container";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn more about COUUP's mission and how we connect guests with extraordinary accommodations.",
};

const AboutPage = () => {
  return (
    <div className="pt-28 pb-20">
      <Container>
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl border border-neutral-200">
          <h1 className="text-3xl font-bold mb-8">About Us</h1>
          
          <div className="space-y-6 text-neutral-600 leading-relaxed">
            <p className="text-lg">
              Welcome to <strong>Couup</strong>, the premier digital marketplace that connects Guests seeking extraordinary accommodations with Hosts offering exceptional properties.
            </p>
            
            <div>
              <h2 className="text-xl font-bold text-neutral-800 mb-2">Our Mission</h2>
              <p>
                Our mission is to simplify travel and empower property owners. We provide the robust technology needed to facilitate seamless connections, offering features like intuitive search, personalized wishlists, and secure payment processing. 
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-neutral-800 mb-2">What We Do</h2>
              <p>
                Whether you are looking for a weekend getaway, a luxury resort in Udaipur, or a budget stay, Couup brings you the finest collection of properties tailored for your perfect trip. For hosts, we offer a powerful platform to list their spaces and reach a global audience with ease.
              </p>
            </div>
            
            <div className="mt-8 pt-8 border-t border-neutral-200">
              <p className="text-center italic">
                Experience unparalleled luxury and unforgettable stays with Couup.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default AboutPage;
