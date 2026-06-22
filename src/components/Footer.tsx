const Footer = () => {
  return (
    <footer className="w-full border-t border-gray-200 py-6 mt-10 bg-gray-50">
      <div className="max-w-[2520px] mx-auto xl:px-20 md:px-10 sm:px-2 px-4 text-center text-gray-500 text-sm flex flex-col md:flex-row justify-between items-center gap-4">
        <p>© 2026 Airbnb Clone, Inc. All rights reserved.</p>
        <div className="flex flex-row gap-4 font-semibold">
          <span className="hover:underline cursor-pointer">Privacy</span>
          <span className="hover:underline cursor-pointer">Terms</span>
          <span className="hover:underline cursor-pointer">Sitemap</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
