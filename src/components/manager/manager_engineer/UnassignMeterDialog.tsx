import { useState } from "react";
import { useDispatch } from "react-redux";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { unassignMeterFromEngineer } from "@/store/slices/manager/managerThunks";
import { AppDispatch } from "@/store";

interface UnassignMeterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  meterId: number;
  engineerId: number;
  meterDeviceId: number | string;
}

export default function UnassignMeterDialog({
  isOpen,
  onClose,
  meterId,
  engineerId,
  meterDeviceId,
}: UnassignMeterDialogProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [isLoading, setIsLoading] = useState(false);

  const handleUnassign = async () => {
    setIsLoading(true);
    try {
      const result = await dispatch(
        unassignMeterFromEngineer({
          meter_id: meterId,
          engineer_id: engineerId,
        })
      );

      if (result.meta.requestStatus === "fulfilled") {
        onClose();
      }
    } catch (error) {
      console.error("Failed to unassign meter:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-[#101828] border border-gray-700 text-text-primary">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-text-primary">
            Confirm Unassignment
          </DialogTitle>
          <DialogDescription className="text-text-secondary">
            Are you sure you want to unassign Meter (Device ID: {meterDeviceId})
            from this engineer?
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex justify-end space-x-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="bg-transparent text-text-primary border border-text-secondary hover:border-accent-color"
          >
            No, Cancel
          </Button>
          <Button
            type="button"
            onClick={handleUnassign}
            disabled={isLoading}
            className="bg-(--color-bg-accent) text-(--color-text-secondary) hover:bg-(--color-bg-accent-hover) transition-colors"
          >
            {isLoading ? "Processing..." : "Yes, Unassign"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
