import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchManagers } from "../../store/slices/admin/adminThunks";
import { RootState, AppDispatch } from "../../store/index";
import { Manager as ManagerType } from "../../store/slices/admin/adminTypes";
import ManagerDetail from "./ManagerDetail";

export default function Manager() {
  const dispatch = useDispatch<AppDispatch>();
  const { managers } = useSelector((state: RootState) => state.admin);
  const [selectedManager, setSelectedManager] = useState<ManagerType | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchManagers());
  }, [dispatch]);

  const handleRowClick = (manager: ManagerType) => {
    setSelectedManager(manager);
    setIsDialogOpen(true);
  };

  //   if (isLoading) {
  //     return (
  //       <div className="flex flex-col items-center justify-center h-screen">
  //         <p className="text-gray-300">Loading managers...</p>
  //       </div>
  //     );
  //   }

  //   if (error) {
  //     return (
  //       <div className="flex flex-col items-center justify-center h-screen">
  //         <p className="text-red-500">Error: {error}</p>
  //       </div>
  //     );
  //   }

  return (
    <div className="container mx-auto flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Managers</h1>

      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full bg-gray-800 border border-gray-700">
          <thead>
            <tr className="bg-gray-700">
              <th className="py-3 px-4 border-b border-gray-700 text-left text-gray-300 font-semibold">
                Username
              </th>
              <th className="py-3 px-4 border-b border-gray-700 text-left text-gray-300 font-semibold">
                Email
              </th>
            </tr>
          </thead>
          <tbody>
            {managers.length > 0 ? (
              managers.map((manager: ManagerType) => (
                <tr
                  key={manager.id}
                  className="hover:bg-gray-700 transition-colors cursor-pointer"
                  onClick={() => handleRowClick(manager)}
                >
                  <td className="py-3 px-4 border-b border-gray-700 text-gray-300">
                    {manager.username}
                  </td>
                  <td className="py-3 px-4 border-b border-gray-700 text-gray-300">
                    {manager.email}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="py-6 px-4 border-b border-gray-700 text-center text-gray-400"
                >
                  No managers found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ManagerDetail
        selectedManager={selectedManager}
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
      />
    </div>
  );
}
