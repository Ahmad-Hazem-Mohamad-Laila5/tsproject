type LoadingProps = {
  title?: string;
  subtitle?: string;
  compact?: boolean;
};

const Loading = ({
  title = "Loading fresh results",
  subtitle = "Please wait a moment",
  compact = false,
}: LoadingProps) => {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className={`flex w-full flex-col items-center justify-center text-center ${
        compact ? "min-h-[180px] gap-4" : "min-h-96 gap-5"
      }`}
    >
      <div className="relative">
        <div className="flex size-20 items-center justify-center rounded-3xl border border-app-green/15 bg-gradient-to-br from-app-green/10 via-white to-app-orange/10 shadow-sm">
          <div className="absolute inset-0 rounded-3xl border border-white/60" />

          <div className="relative flex items-center justify-center">
            <div className="absolute size-14 animate-spin rounded-full border-2 border-app-green/15 border-t-app-green" />

            <svg
              viewBox="0 0 64 64"
              fill="none"
              className="relative z-10 size-8"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M20 24C20 14 44 14 44 24"
                stroke="currentColor"
                strokeWidth="3.2"
                strokeLinecap="round"
                className="text-app-green"
              />
              <path
                d="M12 28H52L47 49H17L12 28Z"
                fill="currentColor"
                className="text-app-green/15"
              />
              <path
                d="M12 28H52L47 49H17L12 28Z"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinejoin="round"
                className="text-app-green"
              />
              <path
                d="M24 28L22 49"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                className="text-app-green/50"
              />
              <path
                d="M32 28V49"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                className="text-app-green/50"
              />
              <path
                d="M40 28L42 49"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                className="text-app-green/50"
              />
            </svg>
          </div>
        </div>

        <div className="absolute -bottom-2 left-1/2 h-2 w-14 -translate-x-1/2 rounded-full bg-app-green/10 blur-sm" />
      </div>

      <div className="flex flex-col items-center gap-2">
        <p className="text-sm font-semibold tracking-wide text-zinc-800">
          {title}
        </p>

        <p className="text-xs text-zinc-500">{subtitle}</p>

        <div className="mt-1 flex items-center gap-1.5" aria-hidden="true">
          <span className="size-1.5 animate-bounce rounded-full bg-app-green/40 [animation-delay:0ms]" />
          <span className="size-1.5 animate-bounce rounded-full bg-app-green/55 [animation-delay:120ms]" />
          <span className="size-1.5 animate-bounce rounded-full bg-app-green/70 [animation-delay:240ms]" />
        </div>
      </div>

      <span className="sr-only">{title}</span>
    </div>
  );
};

export default Loading;
