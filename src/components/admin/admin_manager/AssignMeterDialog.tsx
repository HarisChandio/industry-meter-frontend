import { useState, useEffect } from 'react';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Manager, GetMeters } from '@/store/slices/admin/adminTypes';
import {
  assignMeterToManager,
  fetchMeters,
  fetchManagerDetails,
} from '@/store/slices/admin/adminThunks';
import { RootState, AppDispatch } from '@/store';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Redux hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

interface AssignMeterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  manager: Manager;
}

export default function AssignMeterDialog({
  isOpen,
  onClose,
  manager,
}: AssignMeterDialogProps) {
  const dispatch = useAppDispatch();
  const { get_meters, managerDetail } = useAppSelector(
    (state: RootState) => state.admin
  );
  const [selectedMeterId, setSelectedMeterId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);

  // Reset state when dialog opens/closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedMeterId('');
    }
  }, [isOpen]);

  // Fetch data only when the dialog opens and data is not already available
  useEffect(() => {
    if (!isOpen) return;

    // Only fetch meters if they're not already loaded
    if (!get_meters || get_meters.length === 0) {
      setIsLoading(true);
      dispatch(fetchMeters()).then(() => setIsLoading(false));
    }

    // Only fetch manager details if they're not already loaded for this manager
    if (!managerDetail || managerDetail.manager.id !== manager.id) {
      setIsLoading(true);
      dispatch(fetchManagerDetails(manager.id)).then(() => setIsLoading(false));
    }
  }, [dispatch, get_meters, isOpen, manager, managerDetail]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedMeterId) return;

    try {
      setIsAssigning(true);
      await dispatch(
        assignMeterToManager({
          meter: parseInt(selectedMeterId, 10),
          manager: manager.id,
        })
      ).unwrap().then(() => setIsAssigning(false));

      setIsAssigning(true);
      // Refresh manager details after successful assignment
      dispatch(fetchManagerDetails(manager.id)).then(() => setIsAssigning(false));

      // Reset the selected meter and close the dialog
      setSelectedMeterId('');
      onClose();
    } catch (error) {
      console.error('Failed to assign meter:', error);
    }
  };

  // Get the list of meters that are already assigned to this manager
  // Only use managerDetail if it's for the current manager
  const assignedMeterIds =
    (managerDetail?.manager.id === manager.id
      ? managerDetail?.meter_assignments?.map((assignment) => assignment.meter)
      : []) || [];

  // Filter out meters that are already assigned to this manager
  const availableMeters = get_meters.filter(
    (meter) => !assignedMeterIds.includes(meter.id)
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="bg-[#101828] border border-gray-700 text-text-primary"
        aria-describedby="meter-assignment-description"
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-text-primary">
            Assign Meter to Manager
          </DialogTitle>
          <DialogDescription
            id="meter-assignment-description"
            className="text-text-secondary"
          >
            Select a meter to assign to {manager.first_name} {manager.last_name}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 my-4">
          <div className="space-y-2">
            <Label htmlFor="meter-id" className="text-text-secondary">
              Select Meter
            </Label>
            <Select
              value={selectedMeterId}
              onValueChange={setSelectedMeterId}
              key={isOpen ? 'open' : 'closed'} // Force re-render when dialog opens/closes
            >
              <SelectTrigger className="w-full">
                {availableMeters.length > 0 ? (
                  <SelectValue placeholder="Select Meter" />
                ) : (
                  'No Meter'
                )}
              </SelectTrigger>
              <SelectContent>
                {availableMeters.map((meter: GetMeters) => (
                  <SelectItem key={meter.id} value={meter.id.toString()}>
                    ID: {meter.id} - Device: {meter.device_id} ({meter.location}
                    )
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setSelectedMeterId(''); // Reset selection when canceling
                onClose();
              }}
              className="bg-transparent text-text-primary border border-text-secondary hover:border-accent-color"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!selectedMeterId || isLoading || isAssigning}
              className="bg-(--color-bg-accent) text-(--color-text-secondary) hover:bg-(--color-bg-accent-hover) transition-colors"
            >
              {isAssigning ? 'Assigning...' : 'Assign Meter'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
