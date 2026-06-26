import React from "react";

const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-96 h-full w-full gap-6">
      {/* Animated basket */}
      <div className="relative">
        {/* Bouncing fruits */}
        <div className="flex items-end justify-center gap-1 mb-2 h-8">
          {["🍎", "🥦", "🍋"].map((emoji, i) => (
            <span
              key={i}
              className="text-xl animate-bounce"
              style={{
                animationDelay: `${i * 0.15}s`,
                animationDuration: "0.8s",
              }}
            >
              {emoji}
            </span>
          ))}
        </div>

        {/* Basket icon SVG */}
        <div className="relative flex items-center justify-center size-20 rounded-3xl bg-app-green/10 border-2 border-app-green/20">
          <svg
            viewBox="0 0 64 64"
            fill="none"
            className="size-10"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Handle */}
            <path
              d="M20 24 C20 14 44 14 44 24"
              stroke="#2d6a4f"
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
            />
            {/* Basket body */}
            <path
              d="M10 28 H54 L49 50 H15 Z"
              fill="#2d6a4f"
              opacity="0.15"
              stroke="#2d6a4f"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            {/* Basket lines */}
            <line
              x1="24"
              y1="28"
              x2="21"
              y2="50"
              stroke="#2d6a4f"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.5"
            />
            <line
              x1="32"
              y1="28"
              x2="32"
              y2="50"
              stroke="#2d6a4f"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.5"
            />
            <line
              x1="40"
              y1="28"
              x2="43"
              y2="50"
              stroke="#2d6a4f"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.5"
            />
          </svg>

          {/* Pulse ring */}
          <span className="absolute inset-0 rounded-3xl border-2 border-app-green/30 animate-ping" />
        </div>
      </div>

      {/* Text */}
      <div className="flex flex-col items-center gap-1.5">
        <p className="text-sm font-semibold text-app-green tracking-wide">
          Picking fresh items...
        </p>

        {/* Animated dots */}
        <div className="flex items-center gap-1.5">
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              className="size-1.5 rounded-full bg-app-green/40 animate-bounce"
              style={{
                animationDelay: `${i * 0.15}s`,
                animationDuration: "0.9s",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Loading;
