import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { Launch } from "../interfaces/launches";

export default function LaunchDetails({
  launch,
  onClose,
}: {
  launch: Launch;
  onClose: any;
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
          {launch.mission_name}
        </h2>
        {launch.links.video_link ? (
          <div className="aspect-w-16 aspect-h-9 mb-4">
            <iframe
              src={launch.links.video_link.replace("watch?v=", "embed/")}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
              style={{ height: 300 }}
            ></iframe>
          </div>
        ) : (
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            No video available for this launch.
          </p>
        )}
        <div className="mb-4">
          <p className="text-gray-600 dark:text-gray-400">
            Launch Year: {launch.launch_year}
          </p>
          <p className="text-gray-600 dark:text-gray-400 flex items-center mt-2">
            Launch Status:
            {launch.launch_success ? (
              <>
                <FaCheckCircle className="text-green-500 ml-2 mr-1" /> Success
              </>
            ) : (
              <>
                <FaTimesCircle className="text-red-500 ml-2 mr-1" /> Failure
              </>
            )}
          </p>
        </div>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          {launch.details || "No additional details available."}
        </p>
        <button
          onClick={onClose}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
}
