import { DeviceData } from '@/store/slices/admin/adminTypes';

// Common interface for tab components
export interface TabProps {
  onDeleteDevice?: () => void;
  isLoading?: boolean;
  deviceData?: DeviceData;
  onGenerateAlarmReport?: () => void;
  onGenerateReport?: () => void;
}
