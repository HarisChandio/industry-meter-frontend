import { useDispatch, useSelector } from 'react-redux';
import {
  deleteDevice,
  generateMeterReport,
  fetchDeviceData,
} from '@/store/slices/admin/adminThunks';
import { AppDispatch, RootState } from '@/store';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

// Import the extracted components
import EngineTab from '@/components/common/device_comp/EngineTab';
import GeneratorTab from '@/components/common/device_comp/GeneratorTab';
import AlarmsTab from '@/components/common/device_comp/AlarmsTab';
import {
  TabButtons,
  TabOption,
} from '@/components/common/device_comp/TabButtons';
import Loading from '@/components/common/Loading';

export default function DeviceDetails() {
  const { slug } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const isLoading = useSelector((state: RootState) => state.admin.isLoading);
  const location = useLocation();

  // Define tab options
  const tabOptions: TabOption[] = [
    { id: 'engine', label: 'Engine' },
    { id: 'generator', label: 'Generator' },
    { id: 'alarms', label: 'Alarms' },
  ];

  // Get the active tab from localStorage or use default "engine"
  const [activeTab, setActiveTab] = useState<'engine' | 'generator' | 'alarms'>(
    () => {
      const savedTab = localStorage.getItem('activeDeviceTab');
      return (savedTab as 'engine' | 'generator' | 'alarms') || 'engine';
    }
  );

  const { currentDeviceData } = useSelector((state: RootState) => state.admin);
  console.log('Current Device Data:', currentDeviceData);

  // Save the active tab to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('activeDeviceTab', activeTab);
  }, [activeTab]);

  // Fetch device data when component mounts
  useEffect(() => {
    if (slug) {
      // Extract the device ID from the slug if needed
      const deviceId = parseInt(
        slug.includes('/') ? slug.split('/').pop() || slug : slug
      );

      // Get the meterId from location state if available
      const meterId = location.state?.meterId || deviceId;

      console.log('Fetching device data for ID:', meterId);
      dispatch(fetchDeviceData(meterId))
        .unwrap()
        .catch((error) => {
          console.error('Failed to fetch device data:', error);
          toast.error('Failed to load device data');
        });
    }
  }, [slug, dispatch, location.state, activeTab]);

  const handleDeleteDevice = () => {
    if (slug) {
      const deviceId = slug.includes('/') ? slug.split('/').pop() : slug;
      console.log('Extracted device ID:', deviceId);
      dispatch(deleteDevice((deviceId || slug) as string))
        .unwrap()
        .then(() => {
          navigate('/admin/dashboard');
        })
        .catch((error) => {
          console.error('Failed to delete device:', error);
        });
    }
  };

  const handleGenerateReport = () => {
    if (slug) {
      // Log the full slug value for debugging
      console.log('Generating report for device:', slug);

      // If the slug contains additional path segments (like 'dashboard/generator')
      // Extract just the device ID part if needed
      const deviceId = slug.includes('/') ? slug.split('/').pop() : slug;
      console.log('Extracted device ID:', deviceId);

      dispatch(
        generateMeterReport({
          meter_id: deviceId || slug,
          time_range: 'last_24',
        })
      )
        .unwrap()
        .then(() => {
          console.log('Report generated successfully');
        })
        .catch((error) => {
          console.error('Failed to generate report:', error);
        });
    }
  };

  return (
    <div className="flex flex-col relative h-[calc(100vh-3rem)] bg-background-dark text-text-primary">
      <div className="h-12 absolute bottom-0 right-0 left-0">
        <TabButtons
          tabs={tabOptions}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          styleVariant="engineer"
        />
      </div>

      <div className="flex-1 overflow-auto px-4 no-scrollbar mb-14">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loading />
          </div>
        ) : (
          <>
            {activeTab === 'engine' && (
              <EngineTab
                onDeleteDevice={handleDeleteDevice}
                isLoading={isLoading}
                deviceData={currentDeviceData || undefined}
                onGenerateReport={handleGenerateReport}
              />
            )}
            {activeTab === 'generator' && (
              <GeneratorTab
                deviceData={currentDeviceData || undefined}
                onDeleteDevice={handleDeleteDevice}
                isLoading={isLoading}
                onGenerateReport={handleGenerateReport}
              />
            )}
            {activeTab === 'alarms' && (
              <AlarmsTab
                deviceData={currentDeviceData || undefined}
                onDeleteDevice={handleDeleteDevice}
                isLoading={isLoading}
                onGenerateReport={handleGenerateReport}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
