import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { fetchEngineers } from '@/store/slices/admin/adminThunks';
import { Engineer as EngineerType } from '@/store/slices/admin/adminTypes';
import Loading from '@/components/common/Loading';
import SearchInput from '../../common/SearchInput';

export default function Engineer() {
  const dispatch = useDispatch<AppDispatch>();
  const { engineers } = useSelector((state: RootState) => state.admin);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

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

  return (
    <div className="container mx-auto flex flex-col gap-4">
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
                      ? 'No matching engineers found'
                      : 'No engineers found'}
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
