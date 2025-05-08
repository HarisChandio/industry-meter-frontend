import { useState, useEffect } from "react";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Manager, GetMeters } from "@/store/slices/admin/adminTypes";
import {
  assignMeterToManager,
  fetchMeters,
  fetchManagerDetails,
} from "@/store/slices/admin/adminThunks";
import { RootState, AppDispatch } from "@/store";

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
  const { get_meters, isLoading, managerDetail } = useAppSelector(
    (state: RootState) => state.admin
  );
  const [selectedMeterId, setSelectedMeterId] = useState<string>("");

  // Fetch data only when the dialog opens and data is not already available
  useEffect(() => {
    if (!isOpen) return;

    // Only fetch meters if they're not already loaded
    if (!get_meters || get_meters.length === 0) {
      dispatch(fetchMeters());
    }

    // Only fetch manager details if they're not already loaded for this manager
    if (!managerDetail || managerDetail.manager.id !== manager.id) {
      dispatch(fetchManagerDetails(manager.id));
    }
  }, [dispatch, get_meters, isOpen, manager, managerDetail]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedMeterId) return;

    try {
      await dispatch(
        assignMeterToManager({
          meter: parseInt(selectedMeterId, 10),
          manager: manager.id,
        })
      ).unwrap();

      // Refresh manager details after successful assignment
      dispatch(fetchManagerDetails(manager.id));

      onClose();
    } catch (error) {
      console.error("Failed to assign meter:", error);
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
            <select
              id="meter-id"
              value={selectedMeterId}
              onChange={(e) => setSelectedMeterId(e.target.value)}
              className="w-full h-10 px-3 py-2 bg-[#1D2939] border border-gray-700 rounded-md text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-color"
            >
              <option value="">Select a meter</option>
              {availableMeters.map((meter: GetMeters) => (
                <option key={meter.id} value={meter.id.toString()}>
                  ID: {meter.id} - Device: {meter.device_id} ({meter.location})
                </option>
              ))}
            </select>
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="bg-transparent text-text-primary border border-text-secondary hover:border-accent-color"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!selectedMeterId || isLoading}
              className="bg-(--color-bg-accent) text-(--color-text-secondary) hover:bg-(--color-bg-accent-hover) transition-colors"
            >
              {isLoading ? "Assigning..." : "Assign Meter"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
