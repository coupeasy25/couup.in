import ClientOnly from "@/components/ClientOnly";
import HelpClient from "./HelpClient";
import getCurrentUser from "@/actions/getCurrentUser";

const HelpPage = async () => {
  // We can pass currentUser if we want the navbar to show the logged-in user 
  // or if we want to personalize the help page (e.g. "Hi, Neev! How can we help?").
  // But the layout already handles the navbar. 
  // Let's pass it anyway for potential personalization.
  const currentUser = await getCurrentUser();

  return (
    <HelpClient currentUser={currentUser} />
  );
};

export default HelpPage;
