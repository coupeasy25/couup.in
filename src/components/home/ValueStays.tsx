"use client";

import Image from "next/image";

const valueStaysData = [
  {
    id: 1,
    title: "Hotels",
    subtitle: "Affordable & comfortable rooms",
    discount: "Upto 35% off",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    title: "Resorts",
    subtitle: "Perfect for a relaxing getaway",
    discount: "Upto 40% off",
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
];

const ValueStays = () => {
  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="py-8">
      <div className="flex flex-col mb-6">
        <h2 className="text-2xl font-bold text-neutral-900">Value Stays</h2>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {valueStaysData.map((item) => (
          <div
            key={item.id}
            onClick={handleClick}
            className="relative h-[250px] w-full overflow-hidden rounded-2xl cursor-pointer block"
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            
            {/* Gradient Overlay for Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/40"></div>

            {/* Content */}
            <div className="absolute inset-0 p-5 flex flex-col justify-between z-10">
              <div>
                <h3 className="text-2xl font-bold text-white mb-1">{item.title}</h3>
                <p className="text-white/90 text-sm font-medium">{item.subtitle}</p>
              </div>

              {/* <div>
                <span className="inline-block bg-[#F43F5E] text-white text-sm font-semibold px-3 py-1.5 rounded-md">
                  {item.discount}
                </span>
              </div> */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ValueStays;
