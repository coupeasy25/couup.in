export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white">
      {/* Top progress bar */}
      <div className="absolute top-0 left-0 w-full h-[3px] overflow-hidden">
        <div
          style={{
            animation: "progressBar 1.6s ease-in-out infinite",
          }}
          className="h-full bg-gradient-to-r from-transparent via-[#F97316] to-transparent w-1/2"
        />
      </div>

      <div className="flex flex-col items-center gap-6">
        {/* Spinner rings */}
        <div className="relative flex items-center justify-center w-20 h-20">
          {/* Outer slow ring */}
          <div
            style={{ animation: "spinReverse 2.4s linear infinite" }}
            className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-[#F97316]/30 border-r-[#F97316]/30"
          />
          {/* Middle ring */}
          <div
            style={{ animation: "spin 1.4s linear infinite" }}
            className="absolute inset-[8px] rounded-full border-[3px] border-transparent border-t-[#F97316] border-l-[#F97316]/50"
          />
          {/* Inner fast ring */}
          <div
            style={{ animation: "spinReverse 0.9s linear infinite" }}
            className="absolute inset-[16px] rounded-full border-[2px] border-transparent border-t-[#F97316]/70"
          />
          {/* Pulsing center dot */}
          <div
            style={{ animation: "pulse 1.2s ease-in-out infinite" }}
            className="w-3 h-3 rounded-full bg-[#F97316]"
          />
        </div>

        {/* Loading text with dots animation */}
        <div className="flex items-center gap-1">
          <span className="text-neutral-500 text-sm font-medium tracking-wide">
            Loading
          </span>
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              style={{
                animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
              }}
              className="inline-block w-1 h-1 rounded-full bg-[#F97316]"
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes progressBar {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes spinReverse {
          to { transform: rotate(-360deg); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50%       { transform: scale(1.4); opacity: 0.7; }
        }
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40%            { transform: translateY(-4px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
