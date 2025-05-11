import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMeters } from '@/store/slices/engineer/engineerThunks';
import { RootState, AppDispatch } from '@/store';
import { GetMeters } from '@/store/slices/engineer/engineerTypes';
import SearchInput from '../common/SearchInput';
import Loading from '../common/Loading';

export default function Devices() {
  const dispatch = useDispatch<AppDispatch>();
  const { get_meters, isLoading } = useSelector(
    (state: RootState) => state.engineer
  );
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredMeters, setFilteredMeters] = useState<GetMeters[]>([]);

  useEffect(() => {
    dispatch(fetchMeters());
  }, [dispatch, location.key]);

  useEffect(() => {
    if (!get_meters) return;

    if (searchTerm.trim() === '') {
      setFilteredMeters(get_meters);
    } else {
      const lowercaseSearchTerm = searchTerm.toLowerCase();

      // Filter meters
      const filtered = get_meters.filter(
        (meter: GetMeters) =>
          meter.device_id.toString().includes(searchTerm) ||
          meter.location.toLowerCase().includes(lowercaseSearchTerm)
      );
      setFilteredMeters(filtered);
    }
  }, [searchTerm, get_meters]);

  const navigate = useNavigate();

  const handleDeviceClick = (device_id: number, id: number) => {
    console.log('Device ID clicked:', device_id);
    // Directly navigate to the device details page
    // The data will be fetched in the DeviceDetails component
    navigate(`/engineer/dashboard/${device_id}`, { state: { meterId: id } });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Devices</h1>

        <div className="flex items-center gap-2">
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search by ID or location..."
          />
        </div>
      </div>

      {isLoading ? (
        <div className="col-span-3 flex items-center justify-center py-20">
          <Loading />
        </div>
      ) : (
        <>
          {/* Available Meters Section */}
          <div className="">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMeters && filteredMeters.length > 0 ? (
                filteredMeters.map((meter: GetMeters) => (
                  <div
                    key={meter.id}
                    onClick={() => handleDeviceClick(meter.device_id, meter.id)}
                    className="cursor-pointer bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex flex-col">
                      <span className="font-semibold text-lg ">
                        Device ID: {meter.device_id}
                      </span>
                      <span className="text-sm text-gray-400">
                        Location: {meter.location}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-3 text-center py-8">
                  No devices found
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
