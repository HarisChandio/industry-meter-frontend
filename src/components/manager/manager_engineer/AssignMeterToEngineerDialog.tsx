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
import { Engineer, GetMeters } from "@/store/slices/manager/managerTypes";
import {
  assignMeterToEngineer,
  fetchMeters,
} from "@/store/slices/manager/managerThunks";
import { RootState, AppDispatch } from "@/store";

// Redux hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

interface AssignMeterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  engineer: Engineer;
}

export default function AssignMeterToEngineerDialog({
  isOpen,
  onClose,
  engineer,
}: AssignMeterDialogProps) {
  const dispatch = useAppDispatch();
  const { get_meters, engineers, isLoading } = useAppSelector(
    (state: RootState) => state.manager
  );
  const [selectedMeterId, setSelectedMeterId] = useState<string>("");

  // Fetch data only when the dialog opens and data is not already available
  useEffect(() => {
    if (!isOpen) return;

    // Always fetch fresh meters data when dialog opens
    dispatch(fetchMeters());
    setSelectedMeterId("");
  }, [dispatch, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedMeterId) return;

    try {
      const result = await dispatch(
        assignMeterToEngineer({
          meter_id: parseInt(selectedMeterId, 10),
          engineer_id: engineer.id,
        })
      );

      // Check for errors before unwrapping
      if (result.meta.requestStatus === "fulfilled") {
        onClose();
      } else {
        console.error("Failed to assign meter:", result.payload);
      }
    } catch (error) {
      console.error("Failed to assign meter:", error);
    }
  };

  console.log("engineers", engineers);

  const availableMeters = get_meters.filter((meter) => {
    // Check if this meter is not assigned to any engineer
    return !engineers?.some((engineer) =>
      engineer.meters?.some((engineerMeter) => engineerMeter.id === meter.id)
    );
  });

  console.log("availableMeters", availableMeters);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="bg-[#101828] border border-gray-700 text-text-primary"
        onOpenAutoFocus={(e) => e.preventDefault()} // Prevent auto-focus which can cause aria-hidden issues
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-text-primary">
            Assign Meter to Engineer
          </DialogTitle>
          <DialogDescription className="text-text-secondary">
            Select a meter to assign to {engineer.first_name}{" "}
            {engineer.last_name}
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
              {availableMeters.length > 0 ? (
                availableMeters.map((meter: GetMeters) => (
                  <option key={meter.id} value={meter.id.toString()}>
                    ID: {meter.id} - Device: {meter.device_id} ({meter.location}
                    )
                  </option>
                ))
              ) : (
                <option value="" disabled>
                  No available meters found
                </option>
              )}
            </select>
            {availableMeters.length === 0 && (
              <p className="text-red-500 text-sm mt-1">
                All meters are currently assigned. No meters available for
                assignment.
              </p>
            )}
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
              disabled={
                !selectedMeterId || isLoading || availableMeters.length === 0
              }
              className="bg-accent-color text-text-primary hover:bg-accent-hover transition-colors"
            >
              {isLoading ? "Assigning..." : "Assign Meter"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
