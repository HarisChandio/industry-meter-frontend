import { useState, useEffect } from "react";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Manager } from "../../store/slices/admin/adminTypes";
import {
  assignEngineerToManager,
  fetchEngineers,
} from "../../store/slices/admin/adminThunks";
import { RootState, AppDispatch } from "../../store";

// Redux hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

interface AssignEngineerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  manager: Manager;
}

export default function AssignEngineerDialog({
  isOpen,
  onClose,
  manager,
}: AssignEngineerDialogProps) {
  const dispatch = useAppDispatch();
  const { engineers, isLoading } = useAppSelector(
    (state: RootState) => state.admin
  );
  const [selectedEngineerId, setSelectedEngineerId] = useState<string>("");

  // Fetch engineers if not available in state
  useEffect(() => {
    if (isOpen && (!engineers || engineers.length === 0)) {
      dispatch(fetchEngineers());
    }
  }, [dispatch, engineers, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedEngineerId) return;

    try {
      await dispatch(
        assignEngineerToManager({
          manager_id: manager.id,
          engineer_id: parseInt(selectedEngineerId, 10),
        })
      ).unwrap();

      onClose();
    } catch (error) {
      console.error("Failed to assign engineer:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#101828] border border-gray-700 text-text-primary">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-text-primary">
            Assign Engineer to Manager
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 my-4">
          <div className="space-y-2">
            <Label htmlFor="engineer-id" className="text-text-secondary">
              Select Engineer
            </Label>
            <select
              id="engineer-id"
              value={selectedEngineerId}
              onChange={(e) => setSelectedEngineerId(e.target.value)}
              className="w-full h-10 px-3 py-2 bg-[#1D2939] border border-gray-700 rounded-md text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-color"
            >
              <option value="">Select an engineer</option>
              {engineers.map((engineer) => (
                <option key={engineer.id} value={engineer.id.toString()}>
                  {engineer.first_name} {engineer.last_name} (
                  {engineer.username})
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
              disabled={!selectedEngineerId || isLoading}
              className="bg-accent-color text-text-primary hover:bg-accent-hover transition-colors"
            >
              {isLoading ? "Assigning..." : "Assign Engineer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
