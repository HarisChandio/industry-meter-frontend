import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Engineer } from "@/store/slices/manager/managerTypes";
import { PlusIcon, GaugeIcon } from "lucide-react";
import AssignMeterToEngineerDialog from "./AssignMeterToEngineerDialog";
import UnassignMeterDialog from "./UnassignMeterDialog";
import { fetchEngineers } from "@/store/slices/manager/managerThunks";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { HoverName } from "@/components/common/HoverName";

interface EngineerDetailProps {
  selectedEngineer: Engineer | null;
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
}

interface MeterData {
  id: number;
  device_id: number;
  location: string;
  status: string;
  assigned_at: string;
}

export default function EngineerDetail({
  selectedEngineer,
  isDialogOpen,
  setIsDialogOpen,
}: EngineerDetailProps) {
  const [isAssignMeterDialogOpen, setIsAssignMeterDialogOpen] = useState(false);
  const [isUnassignMeterDialogOpen, setIsUnassignMeterDialogOpen] =
    useState(false);
  const [selectedMeter, setSelectedMeter] = useState<MeterData | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const { engineers, isLoading, error } = useSelector(
    (state: RootState) => state.manager
  );
  const [assignedMeters, setAssignedMeters] = useState<MeterData[]>([]);

  useEffect(() => {
    if (selectedEngineer && isDialogOpen) {
      dispatch(fetchEngineers());
    }
  }, [selectedEngineer, isDialogOpen, dispatch]);

  useEffect(() => {
    // Find the updated engineer data and get assigned meters when engineers data updates
    if (selectedEngineer && engineers.length > 0) {
      const updatedEngineer = engineers.find(
        (eng) => eng.id === selectedEngineer.id
      );

      if (updatedEngineer && updatedEngineer.meters) {
        // Map the engineer's meters to the MeterData format
        const meters = updatedEngineer.meters.map((meter) => ({
          id: meter.id,
          device_id: Number(meter.device_id),
          location: meter.location,
          status: "Active", // Default status or get from API if available
          assigned_at: meter.updated_at,
        }));

        setAssignedMeters(meters);
      } else {
        setAssignedMeters([]);
      }
    }
  }, [selectedEngineer, engineers]);

  const handleAssignMeter = () => {
    setIsAssignMeterDialogOpen(true);
  };

  const handleCloseMeterDialog = () => {
    setIsAssignMeterDialogOpen(false);
    // Refresh data after assigning a meter
    if (selectedEngineer) {
      dispatch(fetchEngineers());
    }
  };

  const handleUnassignMeter = (meter: MeterData) => {
    setSelectedMeter(meter);
    setIsUnassignMeterDialogOpen(true);
  };

  const handleCloseUnassignDialog = () => {
    setIsUnassignMeterDialogOpen(false);
    setSelectedMeter(null);
    // Refresh data after unassigning
    if (selectedEngineer) {
      dispatch(fetchEngineers());
    }
  };

  if (!selectedEngineer) {
    return null;
  }

  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-(--surface-dark) border border-gray-700 text-(--text-primary) max-h-[90vh] overflow-y-auto no-scrollbar">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-(--text-primary)">
              Engineer Details
            </DialogTitle>
            <DialogDescription className="text-(--text-secondary)">
              View and manage details for {selectedEngineer.first_name}{" "}
              {selectedEngineer.last_name}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 my-2">
            {/* Engineer Info Card */}
            <div className="bg-(--surface-dark) p-2 rounded-lg border border-gray-700 shadow-md">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 truncate">
                <div className="space-y-1">
                  <p className="text-(--text-secondary) text-sm font-medium">
                    Username
                  </p>
                  <p className="text-(--text-primary) text-sm font-semibold">
                    {selectedEngineer.username}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-(--text-secondary) text-sm font-medium">
                    Email
                  </p>
                  <p className="text-(--text-primary) text-sm font-semibold">
                    {selectedEngineer.email}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <div className="bg-(--surface-dark) rounded-lg border border-gray-700 shadow-md">
                <div className="overflow-x-auto">
                  {isLoading ? (
                    <div className="flex justify-center items-center py-8">
                      <div className="w-10 h-10 border-4 border-transparent rounded-full animate-spin border-t-accent-color"></div>
                      <span className="ml-3 text-(--text-secondary)">
                        Loading assigned meters...
                      </span>
                    </div>
                  ) : error ? (
                    <div className="text-red-500 py-4 text-center">
                      {typeof error === "object"
                        ? (error as { message?: string }).message ||
                          "An error occurred"
                        : error}
                    </div>
                  ) : assignedMeters.length > 0 ? (
                    <div className="min-w-full max-h-[250px] no-scrollbar overflow-y-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-700">
                            <th className="text-left py-3 px-4 text-(--text-secondary) font-medium">
                              Device ID
                            </th>
                            <th className="text-left py-3 px-4 text-(--text-secondary) font-medium">
                              Location
                            </th>
                            <th className="text-left py-3 px-4 text-(--text-secondary) font-medium">
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {assignedMeters.map((meter) => (
                            <tr
                              key={meter.id}
                              className="border-b border-gray-700 last:border-b-0 hover:bg-gray-800 transition-colors"
                            >
                              <td className="py-3 px-4 text-(--text-primary)">
                                {meter.device_id}
                              </td>
                              <td className="py-3 px-4 text-(--text-primary)">
                                {meter.location}
                              </td>
                              <td className="py-3 px-4 text-(--text-primary)">
                                <button
                                  className="px-4 py-2 bg-accent-color hover:bg-accent-hover text-white rounded-md transition-colors text-sm"
                                  onClick={() => handleUnassignMeter(meter)}
                                >
                                  Unassign Meter
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-(--text-secondary) flex flex-col items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-16 w-16 text-gray-600 mb-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1}
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                      </svg>
                      <p>No meters assigned to this engineer.</p>
                      <button
                        className="mt-4 px-4 py-2 bg-accent-color hover:bg-accent-hover text-white rounded-md transition-colors text-sm"
                        onClick={handleAssignMeter}
                      >
                        Assign New Meter
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <HoverName title="Assign Meter">
              <Button
                variant="outline"
                className="bg-surface-dark text-text-primary border border-text-secondary hover:border-accent-color hover:bg-[#101828] hover:text-accent-hover"
                onClick={handleAssignMeter}
              >
                <PlusIcon className="size-3" />
                <GaugeIcon className="size-4" />
              </Button>
            </HoverName>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {selectedEngineer && (
        <AssignMeterToEngineerDialog
          isOpen={isAssignMeterDialogOpen}
          onClose={handleCloseMeterDialog}
          engineer={selectedEngineer}
        />
      )}

      {selectedEngineer && selectedMeter && (
        <UnassignMeterDialog
          isOpen={isUnassignMeterDialogOpen}
          onClose={handleCloseUnassignDialog}
          meterId={selectedMeter.id}
          engineerId={selectedEngineer.id}
          meterDeviceId={selectedMeter.device_id}
        />
      )}
    </>
  );
}
