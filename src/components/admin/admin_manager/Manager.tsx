import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchManagers } from '@/store/slices/admin/adminThunks';
import { RootState, AppDispatch } from '@/store';
import { Manager as ManagerType } from '@/store/slices/admin/adminTypes';
import ManagerDetail from './ManagerDetail';
import { SearchIcon } from 'lucide-react';
import Loading from '@/components/common/Loading';

export default function Manager() {
  const dispatch = useDispatch<AppDispatch>();
  const [isLoading, setIsLoading] = useState(false);
  const { managers, error } = useSelector((state: RootState) => state.admin);
  const [selectedManager, setSelectedManager] = useState<ManagerType | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setIsLoading(true);
    dispatch(fetchManagers())
      .unwrap()
      .then(() => {
        setIsLoading(false);
      });
  }, [dispatch]);

  const handleRowClick = (manager: ManagerType) => {
    setSelectedManager(manager);
    setIsDialogOpen(true);
  };

  // Filter managers based on search term
  const filteredManagers = managers.filter((manager) => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      manager.username.toLowerCase().includes(searchTermLower) ||
      manager.email.toLowerCase().includes(searchTermLower)
    );
  });

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Managers</h1>
        <div className="relative w-64">
          <input
            type="text"
            placeholder="Search managers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        </div>
      </div>

      {isLoading ? (
        <div className="col-span-3 flex items-center justify-center py-20">
          <Loading />
        </div>
      ) : (
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
              {filteredManagers.length > 0 ? (
                filteredManagers.map((manager: ManagerType) => (
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
                    colSpan={2}
                    className="py-6 px-4 border-b border-gray-700 text-center text-gray-400"
                  >
                    {searchTerm
                      ? 'No matching managers found'
                      : 'No managers found'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <ManagerDetail
        selectedManager={selectedManager}
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
      />
    </div>
  );
}
