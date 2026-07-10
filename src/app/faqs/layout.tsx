import { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQs",
  description: "Frequently Asked Questions about COUUP.",
};

export default function FAQsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
