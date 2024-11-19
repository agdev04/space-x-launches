import { Launch } from "../interfaces/launches";

const truncateWords = (str: string, numWords: number) => {
  const words = str.split(" ");
  if (words.length > numWords) {
    return words.slice(0, numWords).join(" ") + "...";
  }
  return str;
};

export default function CustomCard({
  launch,
  lastLaunchElementRef,
  filteredLaunches,
  index,
  setSelectedLaunch,
}: {
  launch: Launch;
  lastLaunchElementRef: any;
  filteredLaunches: Launch[];
  index: number;
  setSelectedLaunch: any;
}) {
  return (
    <div
      key={`${launch.flight_number}-${launch.mission_name}`}
      ref={index === filteredLaunches.length - 1 ? lastLaunchElementRef : null}
      className="border border-gray-200 dark:border-gray-700 p-4 rounded-md shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col bg-white dark:bg-gray-800"
    >
      <div className="flex items-center mb-4">
        {launch.links.mission_patch_small ? (
          <img
            src={launch.links.mission_patch_small}
            alt={`${launch.mission_name} mission patch`}
            width={64}
            height={64}
            className="rounded-full mr-4"
            loading="lazy"
          />
        ) : (
          <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full mr-4 flex items-center justify-center">
            <span className="text-gray-500 dark:text-gray-400 text-xs">
              No image
            </span>
          </div>
        )}
        <h2 className="text-xl font-semibold text-blue-600 dark:text-blue-400">
          {launch.mission_name}
        </h2>
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Launch Year: {launch.launch_year}
      </p>
      <p className="mt-2 text-gray-700 dark:text-gray-300 flex-grow">
        {launch.details
          ? truncateWords(launch.details, 20)
          : "No details available"}
      </p>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
        Status:{" "}
        {launch.launch_success ? (
          <span className="text-green-500">Success</span>
        ) : (
          <span className="text-red-500">Failure</span>
        )}
      </p>
      <button
        onClick={() => setSelectedLaunch(launch)}
        className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
      >
        View More
      </button>
    </div>
  );
}
