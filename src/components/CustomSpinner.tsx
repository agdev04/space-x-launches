import { FaSpinner } from "react-icons/fa6";

export default function CustomSpinner() {
  return (
    <div
      className="flex justify-center items-center py-4"
      aria-live="polite"
      aria-busy="true"
    >
      <FaSpinner className="h-6 w-6 animate-spin text-blue-500 dark:text-blue-400" />
      <span className="ml-2 text-gray-600 dark:text-gray-400">
        Loading launches...
      </span>
    </div>
  );
}
