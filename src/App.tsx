import React, { useState, useEffect, useRef, useCallback } from "react";
import { FaSun, FaMoon } from "react-icons/fa";
import CustomSpinner from "./components/CustomSpinner";
import StarryBackground from "./components/StarryBackground";
import CustomCard from "./components/CustomCard";
import { Launch } from "./interfaces/launches";
import LaunchDetails from "./components/LaunchDetails";

export default function SpaceXLaunches() {
  const [launches, setLaunches] = useState<Launch[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const observer = useRef<IntersectionObserver | null>(null);
  const [selectedLaunch, setSelectedLaunch] = useState<Launch | null>(null);
  const [launchSuccessFilter, setLaunchSuccessFilter] = useState<
    boolean | null
  >(null);

  const baseUrl = import.meta.env.VITE_API_URL;

  const fetchLaunches = useCallback(async () => {
    try {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const response = await fetch(
        `${baseUrl}?limit=10&offset=${(page - 1) * 10}`
      );
      const data: Launch[] = await response.json();
      if (data.length === 0) {
        setHasMore(false);
      } else {
        setLaunches((prevLaunches) => {
          const newLaunches = data.filter(
            (newLaunch) =>
              !prevLaunches.some(
                (existingLaunch) =>
                  existingLaunch.flight_number === newLaunch.flight_number
              )
          );
          return [...prevLaunches, ...newLaunches];
        });
        setPage((prevPage) => prevPage + 1);
      }
    } catch (err) {
      setError("Failed to fetch launches");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchLaunches();
  }, [fetchLaunches]);

  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(savedDarkMode);
    if (savedDarkMode) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  const lastLaunchElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          fetchLaunches();
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore, fetchLaunches]
  );

  const filteredLaunches = launches.filter(
    (launch) =>
      (launch.mission_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        launch.launch_year.includes(searchTerm) ||
        (launch.details &&
          launch.details.toLowerCase().includes(searchTerm.toLowerCase()))) &&
      (launchSuccessFilter === null ||
        launch.launch_success === launchSuccessFilter)
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setLoading(false);
  };

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem("darkMode", newDarkMode.toString());
    document.documentElement.classList.toggle("dark", newDarkMode);
  };

  return (
    <div className="h-screen relative">
      <StarryBackground darkMode={darkMode} />
      <div className="bg-white dark:bg-gray-900 absolute inset-0">
        <div className="h-screen overflow-scroll flex-1 absolute z-50 w-full">
          <div className="container mx-auto p-4 space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                SpaceX Launches
              </h1>
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                aria-label="Toggle dark mode"
              >
                {darkMode ? (
                  <FaSun className="h-5 w-5" />
                ) : (
                  <FaMoon className="h-5 w-5" />
                )}
              </button>
            </div>

            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Search missions..."
                value={searchTerm}
                onChange={handleSearch}
                className="flex-grow px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100"
                aria-label="Search missions"
              />
              <select
                value={
                  launchSuccessFilter === null
                    ? ""
                    : launchSuccessFilter.toString()
                }
                onChange={(e) =>
                  setLaunchSuccessFilter(
                    e.target.value === "" ? null : e.target.value === "true"
                  )
                }
                className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100"
              >
                <option value="">All Launches</option>
                <option value="true">Successful Launches</option>
                <option value="false">Failed Launches</option>
              </select>
            </div>

            {error && (
              <p className="text-red-500 dark:text-red-400" role="alert">
                {error}
              </p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredLaunches.map((launch, index) => (
                <CustomCard
                  launch={launch}
                  key={index}
                  lastLaunchElementRef={lastLaunchElementRef}
                  filteredLaunches={filteredLaunches}
                  index={index}
                  setSelectedLaunch={setSelectedLaunch}
                />
              ))}
            </div>

            {loading && searchTerm === "" && <CustomSpinner />}

            {!hasMore &&
              !loading &&
              filteredLaunches.length === launches.length &&
              searchTerm === "" && (
                <p className="text-center text-gray-500 dark:text-gray-400">
                  No more launches to load
                </p>
              )}

            {filteredLaunches.length === 0 && !loading && (
              <p className="text-center text-gray-500 dark:text-gray-400">
                No launches found matching your search.
              </p>
            )}
          </div>
        </div>
      </div>
      {selectedLaunch && (
        <LaunchDetails
          launch={selectedLaunch}
          onClose={() => setSelectedLaunch(null)}
        />
      )}
    </div>
  );
}
