import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AppDispatch } from '@/store';
import { generateAlarmMeterReport } from '@/store/slices/admin/adminThunks';
import { toast } from 'sonner';
import ManualModeHeader from './ManualModeHeader';
import { TabProps } from './TabProps';

function AlarmsTab({
  deviceData,
  onDeleteDevice,
  isLoading,
  onGenerateReport,
}: TabProps) {
  console.log('Alarms Tab Dataaaa:', deviceData);
  const dispatch = useDispatch<AppDispatch>();
  const { slug } = useParams();

  const alarms = [
    {
      id: 1,
      timestamp: '2023-05-15 08:23:15',
      type: 'Warning',
      message: 'Low Fuel Level',
      status: 'Active',
    },
    {
      id: 2,
      timestamp: '2023-05-14 14:45:32',
      type: 'Critical',
      message: 'High Engine Temperature',
      status: 'Resolved',
    },
    {
      id: 3,
      timestamp: '2023-05-14 09:12:45',
      type: 'Info',
      message: 'Maintenance Required',
      status: 'Active',
    },
    {
      id: 4,
      timestamp: '2023-05-13 22:34:18',
      type: 'Warning',
      message: 'Battery Voltage Low',
      status: 'Active',
    },
    {
      id: 5,
      timestamp: '2023-05-12 16:09:23',
      type: 'Critical',
      message: 'Emergency Stop Activated',
      status: 'Resolved',
    },
  ];

  const handleGenerateAlarmReport = () => {
    console.log('Generating alarm report...');
    console.log('Device Data:', deviceData);
    const deviceId = slug?.includes('/') ? slug.split('/').pop() : slug;
    console.log('Extracted device ID:', deviceId);

    if (deviceData) {
      dispatch(
        generateAlarmMeterReport({
          meter_id: deviceId || slug || '',
          time_range: 'last_24',
        })
      )
        .unwrap()
        .then(() => {
          console.log('Alarm report generated successfully');
        })
        .catch((error) => {
          console.error('Failed to generate alarm report:', error);
        });
    } else {
      toast.error('No device data available for report generation');
    }
  };

  return (
    <div className="flex flex-col gap-6 py-4">
      <ManualModeHeader
        deviceData={deviceData}
        onDeleteDevice={onDeleteDevice}
        onGenerateReport={onGenerateReport}
        isLoading={isLoading}
        showReportButton={true}
        showDeleteButton={true}
        customReportButton={
          <Button
            variant="outline"
            className="text-accent-color hover:text-accent-hover bg-transparent hover:bg-surface-dark border-accent-color"
            onClick={() => handleGenerateAlarmReport()}
            disabled={isLoading}
          >
            Alarm Report
          </Button>
        }
      />

      <div className="bg-surface-dark p-4 rounded-lg border border-text-secondary shadow-md">
        <div className="grid grid-cols-12 gap-4 border-b border-text-secondary pb-2 mb-2 font-semibold text-accent-color">
          <div className="col-span-1">#</div>
          <div className="col-span-3">Timestamp</div>
          <div className="col-span-2">Type</div>
          <div className="col-span-4">Message</div>
          <div className="col-span-2">Status</div>
        </div>

        {alarms.map((alarm) => (
          <div
            key={alarm.id}
            className="grid grid-cols-12 gap-4 py-3 border-b border-text-secondary/30 text-sm"
          >
            <div className="col-span-1 text-text-secondary">{alarm.id}</div>
            <div className="col-span-3 text-text-primary">
              {alarm.timestamp}
            </div>
            <div
              className={`col-span-2 font-medium ${
                alarm.type === 'Critical'
                  ? 'text-destructive'
                  : alarm.type === 'Warning'
                  ? 'text-chart-3'
                  : 'text-accent-color'
              }`}
            >
              {alarm.type}
            </div>
            <div className="col-span-4 text-text-primary">{alarm.message}</div>
            <div
              className={`col-span-2 font-medium ${
                alarm.status === 'Active' ? 'text-destructive' : 'text-chart-1'
              }`}
            >
              {alarm.status}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-surface-dark p-4 rounded-lg border border-text-secondary shadow-md">
          <h2 className="text-lg font-semibold mb-4 text-accent-color">
            Alarm Statistics
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-text-secondary">Total Alarms:</span>
              <span className="text-text-primary">5</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Active Alarms:</span>
              <span className="text-destructive">3</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Critical Alarms:</span>
              <span className="text-destructive">2</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Warnings:</span>
              <span className="text-chart-3">2</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Info:</span>
              <span className="text-accent-color">1</span>
            </div>
          </div>
        </div>

        <div className="bg-surface-dark p-4 rounded-lg border border-text-secondary shadow-md">
          <h2 className="text-lg font-semibold mb-4 text-accent-color">
            Quick Actions
          </h2>
          <div className="space-y-4">
            <Button className="w-full bg-destructive hover:bg-destructive/90">
              Reset All Alarms
            </Button>
            <Button className="w-full bg-chart-1 hover:bg-chart-1/90">
              Configure Alarm Settings
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AlarmsTab;
