import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { fetchEngineers } from '@/store/slices/manager/managerThunks';
import EngineerDetail from './EngineerDetail';
import { Engineer } from '@/store/slices/manager/managerTypes';
import Loading from '@/components/common/Loading';
import SearchInput from '@/components/common/SearchInput';

export default function ManagerEngineer() {
  const dispatch = useDispatch<AppDispatch>();
  const { engineers } = useSelector((state: RootState) => state.manager);
  const [selectedEngineer, setSelectedEngineer] = useState<Engineer | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    setLoading(true);
    dispatch(fetchEngineers())
      .then(() => {
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [dispatch]);

  const handleEngineerClick = (engineer: Engineer) => {
    setSelectedEngineer(engineer);
    setIsDialogOpen(true);
  };

  // Filter engineers based on search term
  const filteredEngineers = engineers.filter((engineer) => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      engineer.username.toLowerCase().includes(searchTermLower) ||
      engineer.email.toLowerCase().includes(searchTermLower)
    );
  });

  return (
    <div className="container mx-auto flex flex-col gap-4">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Engineers</h1>

          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search engineers..."
          />
        </div>

        {isLoading ? (
          <div className="col-span-3 flex items-center justify-center py-20">
            <Loading />
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
                {filteredEngineers && filteredEngineers.length > 0 ? (
                  engineers.map((engineer) => (
                    <tr
                      key={engineer.id}
                      className="border-b border-gray-700 hover:bg-gray-700 transition-colors cursor-pointer"
                      onClick={() => handleEngineerClick(engineer)}
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
                      colSpan={4}
                      className="py-6 px-4 text-center text-gray-400"
                    >
                      No engineers found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <EngineerDetail
        selectedEngineer={selectedEngineer}
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
      />
    </div>
  );
}
