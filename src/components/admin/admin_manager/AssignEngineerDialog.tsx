import { useState, useEffect } from 'react';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Manager } from '@/store/slices/admin/adminTypes';
import {
  assignEngineerToManager,
  fetchEngineers,
  fetchManagerDetails,
} from '@/store/slices/admin/adminThunks';
import { RootState, AppDispatch } from '@/store';

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
  const [Loading, setLoading] = useState(false);
  const { engineers, managerDetail } = useAppSelector(
    (state: RootState) => state.admin
  );
  const [selectedEngineerId, setSelectedEngineerId] = useState<string>('');
  const [isAssigning, setIsAssigning] = useState(false);

  // Reset selectedEngineerId when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedEngineerId('');
    }
  }, [isOpen]);

  // Fetch data only when the dialog opens and data is not already available
  useEffect(() => {
    if (!isOpen) return;

    // Only fetch engineers if they're not already loaded
    if (!engineers || engineers.length === 0) {
      setLoading(true);
      dispatch(fetchEngineers()).then(() => {
        setLoading(false);
      });
    }

    // Only fetch manager details if they're not already loaded for this manager
    if (!managerDetail || managerDetail.manager.id !== manager.id) {
      dispatch(fetchManagerDetails(manager.id));
    }
  }, [dispatch, engineers, isOpen, manager, managerDetail]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedEngineerId) return;

    try {
      setIsAssigning(true);
      await dispatch(
        assignEngineerToManager({
          manager_id: manager.id,
          engineer_id: parseInt(selectedEngineerId, 10),
        })
      )
        .unwrap()
        .then(() => {
          setIsAssigning(false);
        });

      setIsAssigning(true);
      // Refresh manager details after successful assignment
      dispatch(fetchManagerDetails(manager.id)).then(() => {
        setIsAssigning(false);
      });

      onClose();
    } catch (error) {
      console.error('Failed to assign engineer:', error);
    }
  };

  // Get the list of engineers that are already assigned to this manager
  // Only use managerDetail if it's for the current manager
  const assignedEngineerIds =
    (managerDetail?.manager.id === manager.id
      ? managerDetail?.engineer_assignments?.map(
          (assignment) => assignment.engineer
        )
      : []) || [];

  // Filter out engineers that are already assigned to this manager
  const availableEngineers = engineers.filter(
    (engineer) => !assignedEngineerIds.includes(engineer.id)
  );

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
            <Select
              value={selectedEngineerId}
              onValueChange={setSelectedEngineerId}
            >
              <SelectTrigger className="w-full">
                {availableEngineers.length > 0 ? (
                  <SelectValue placeholder="Select Engineer" />
                ) : (
                  'No Engineer'
                )}
              </SelectTrigger>
              <SelectContent>
                {availableEngineers.map((engineer) => (
                  <SelectItem key={engineer.id} value={engineer.id.toString()}>
                    {engineer.first_name} {engineer.last_name} (
                    {engineer.username})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
              disabled={!selectedEngineerId || Loading || isAssigning}
              className="bg-(--color-bg-accent) text-(--color-text-secondary) hover:bg-(--color-bg-accent-hover) transition-colors"
            >
              {isAssigning ? 'Assigning...' : 'Assign Engineer'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
