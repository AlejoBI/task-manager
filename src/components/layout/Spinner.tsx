const SIZES = {
  "4": "h-4 w-4",
  "5": "h-5 w-5",
  "6": "h-6 w-6",
  "8": "h-8 w-8",
  "10": "h-10 w-10",
  "12": "h-12 w-12",
} as const;

interface SpinnerProps {
  size?: keyof typeof SIZES;
  message?: string;
  className?: string;
}

const Spinner = ({ size = "8", message, className = "" }: SpinnerProps) => {
  const sizeClass = SIZES[size];

  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 py-12 ${className}`}
    >
      <div
        className={`${sizeClass} border-[3px] border-gray-100 border-t-indigo-500 rounded-full animate-spin`}
      />
      {message && <p className="text-sm text-gray-400">{message}</p>}
    </div>
  );
};

export default Spinner;
