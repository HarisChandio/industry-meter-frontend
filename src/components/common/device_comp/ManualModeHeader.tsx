import { Button } from '@/components/ui/button';
import { Loader2Icon, Trash2Icon } from 'lucide-react';
import { DeviceData } from '@/store/slices/admin/adminTypes';
import HeaderStats from './HeaderStats';

// Create a reusable ManualModeHeader component
function ManualModeHeader({
  deviceData,
  onDeleteDevice,
  onGenerateReport,
  isLoading,
  showReportButton = false,
  showDeleteButton = false,
  customReportButton = null,
}: {
  deviceData?: DeviceData;
  onDeleteDevice?: () => void;
  onGenerateReport?: () => void;
  isLoading?: boolean;
  showReportButton?: boolean;
  showDeleteButton?: boolean;
  customReportButton?: React.ReactNode;
}) {
  return (
    <>
      <div className="flex justify-end">
        <div className="flex gap-2">
          {showReportButton && onGenerateReport && (
            <Button
              variant="outline"
              className="text-accent-color hover:text-accent-hover bg-transparent hover:bg-surface-dark border-accent-color"
              onClick={onGenerateReport}
              disabled={isLoading}
            >
              Report
            </Button>
          )}
          {customReportButton}
          {showDeleteButton && onDeleteDevice && (
            <Button
              variant="outline"
              className="text-destructive hover:text-destructive/90 bg-transparent hover:bg-surface-dark border-accent-color"
              onClick={onDeleteDevice}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2Icon className="size-6 animate-spin" />
              ) : (
                <Trash2Icon className="size-6" />
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Header stats */}
      <HeaderStats deviceData={deviceData} />
    </>
  );
}

export default ManualModeHeader;
