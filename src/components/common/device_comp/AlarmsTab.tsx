import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AppDispatch } from '@/store';
import { generateAlarmMeterReport } from '@/store/slices/admin/adminThunks';
import { toast } from 'sonner';
import { TabProps } from './TabProps';
import ManualModeHeader from './ManualModeHeader';

function AlarmsTab({
  deviceData,
  onDeleteDevice,
  isLoading,
  onGenerateReport,
}: TabProps) {
  console.log('Alarms Tab Dataaaaaaa:', deviceData);
  const dispatch = useDispatch<AppDispatch>();
  const { slug } = useParams();

  const alarms = [
    {
      id: 1,
      timestamp: '2023-05-15 08:23:15',
      message: 'Low Oil Pressure',
      status: deviceData?.alarm_low_oil_pressure ? 'Active' : 'Inactive',
    },
    {
      id: 2,
      timestamp: '2023-05-14 14:45:32',
      message: 'High Coolant Temperature',
      status: deviceData?.alarm_high_coolant_temp ? 'Active' : 'Inactive',
    },
    {
      id: 3,
      timestamp: '2023-05-14 09:12:45',
      message: 'Crank Failure',
      status: deviceData?.alarm_crank_failure ? 'Active' : 'Inactive',
    },
    {
      id: 4,
      timestamp: '2023-05-13 22:34:18',
      message: 'Low Coolant Level',
      status: deviceData?.alarm_low_coolant_level ? 'Active' : 'Inactive',
    },
    {
      id: 5,
      timestamp: '2023-05-12 16:09:23',
      message: 'Emergency Stop',
      status: deviceData?.alarm_emergency_stop ? 'Active' : 'Inactive',
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
          <div className="col-span-5">Message</div>
          <div className="col-span-3">Status</div>
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
            <div className="col-span-5 text-text-primary">{alarm.message}</div>
            <div
              className={`col-span-3 font-medium ${
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
