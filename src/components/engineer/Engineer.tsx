import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../store";
import { fetchEngineers } from "../../store/slices/admin/adminThunks";

export default function Engineer() {
  const dispatch = useDispatch<AppDispatch>();
  const { engineers } = useSelector((state: RootState) => state.admin);

  useEffect(() => {
    dispatch(fetchEngineers());
  }, [dispatch]);

  //   if (isLoading) {
  //     return (
  //       <div className="flex flex-col items-center justify-center h-64">
  //         <p className="text-gray-400">Loading engineers...</p>
  //       </div>
  //     );
  //   }

  //   if (error) {
  //     return (
  //       <div className="flex flex-col items-center justify-center h-64">
  //         <p className="text-destructive">Error: {error}</p>
  //       </div>
  //     );
  //   }

  return (
    <div className="container mx-auto flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Engineers</h1>
      </div>

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
            {engineers.length > 0 ? (
              engineers.map((engineer) => (
                <tr
                  key={engineer.id}
                  className="border-b border-gray-700 hover:bg-gray-700 transition-colors"
                >
                  <td className="py-3 px-4 text-gray-300">
                    {engineer.username}
                  </td>
                  <td className="py-3 px-4 text-gray-300">{engineer.email}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-6 px-4 text-center text-gray-400">
                  No engineers found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
