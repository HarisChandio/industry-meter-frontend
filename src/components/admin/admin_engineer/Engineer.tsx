import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import { fetchEngineers } from "@/store/slices/admin/adminThunks";
import { Loader2Icon, SearchIcon } from "lucide-react";
import { Engineer as EngineerType } from "@/store/slices/admin/adminTypes";

export default function Engineer() {
  const dispatch = useDispatch<AppDispatch>();
  const { engineers, error } = useSelector((state: RootState) => state.admin);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setIsLoading(true);
    dispatch(fetchEngineers())
      .unwrap()
      .then(() => {
        setIsLoading(false);
      });
  }, [dispatch]);

  // Filter engineers based on search term
  const filteredEngineers = engineers.filter((engineer) => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      engineer.username.toLowerCase().includes(searchTermLower) ||
      engineer.email.toLowerCase().includes(searchTermLower)
    );
  });

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-destructive">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Engineers</h1>
        <div className="relative w-64">
          <input
            type="text"
            placeholder="Search engineers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2Icon className="size-20 text-(--accent-color) animate-spin" />
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-800">
          <table className="min-w-full bg-gray-800 shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-700">
              <tr>
                <th className="py-3 px-4 text-left text-gray-300 font-medium">
                  Username
                </th>
                <th className="py-3 px-4 text-left text-gray-300 font-medium">
                  Email
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredEngineers.length > 0 ? (
                filteredEngineers.map((engineer: EngineerType) => (
                  <tr
                    key={engineer.id}
                    className="border-b border-gray-700 hover:bg-gray-700 transition-colors"
                  >
                    <td className="py-3 px-4 text-gray-300">
                      {engineer.username}
                    </td>
                    <td className="py-3 px-4 text-gray-300">
                      {engineer.email}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={2}
                    className="py-6 px-4 text-center text-gray-400"
                  >
                    {searchTerm
                      ? "No matching engineers found"
                      : "No engineers found"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
