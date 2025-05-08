import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Dialog } from '@/components/ui/dialog';
import {
  Manager as ManagerType,
  GetMeters,
  Engineer,
} from '@/store/slices/admin/adminTypes';
import {
  PlusIcon,
  GaugeIcon,
  UserPlusIcon,
  TrashIcon,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect, useRef } from 'react';
import AssignMeterDialog from './AssignMeterDialog';
import AssignEngineerDialog from './AssignEngineerDialog';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import { fetchManagerDetails } from '@/store/slices/admin/adminThunks';
import { RootState } from '@/store';
import { HoverName } from '@/components/common/HoverName';
import { toast } from 'sonner';
import apiClient from '@/lib/axios';

export default function ManagerDetail({
  selectedManager,
  isDialogOpen,
  setIsDialogOpen,
}: {
  selectedManager: ManagerType | null;
  isDialogOpen: boolean;
  setIsDialogOpen: (isOpen: boolean) => void;
}) {
  const dispatch = useAppDispatch();
  const { managerDetail, isLoading } = useAppSelector(
    (state: RootState) => state.admin
  );
  const [isAssignMeterDialogOpen, setIsAssignMeterDialogOpen] = useState(false);
  const [isAssignEngineerDialogOpen, setIsAssignEngineerDialogOpen] =
    useState(false);
  const [activeTab, setActiveTab] = useState<'meter' | 'engineer'>('meter');

  // Use refs to track if we've already fetched data for this manager
  const dataFetchedRef = useRef<{ [managerId: number]: boolean }>({});
  const lastManagerIdRef = useRef<number | null>(null);

  const [isDeletingEngineerAssignment, setIsDeletingEngineerAssignment] =
    useState<boolean>(false);
  const [deletingEngineerId, setDeletingEngineerId] = useState<number | null>(
    null
  );
  const [isDeletingMeterAssignment, setIsDeletingMeterAssignment] =
    useState<boolean>(false);
  const [deletingMeterId, setDeletingMeterId] = useState<number | null>(null);

  useEffect(() => {
    if (!isDialogOpen || !selectedManager) return;

    const managerId = selectedManager.id;
    const isCurrentManagerDataLoaded =
      managerDetail && managerDetail.manager.id === managerId;

    // Fetch data if:
    // 1. We don't have data for this manager in the state, OR
    // 2. The manager ID has changed from the last one we viewed
    if (!isCurrentManagerDataLoaded || lastManagerIdRef.current !== managerId) {
      dispatch(fetchManagerDetails(managerId));
      dataFetchedRef.current[managerId] = true;
      lastManagerIdRef.current = managerId;
    }
  }, [isDialogOpen, selectedManager, dispatch, managerDetail]);

  const handleAssignMeter = () => {
    setIsAssignMeterDialogOpen(true);
  };

  const handleAssignEngineer = () => {
    setIsAssignEngineerDialogOpen(true);
  };

  const handleCloseMeterDialog = () => {
    setIsAssignMeterDialogOpen(false);

    // Only refresh data if the assignment was successful (the dialog closed normally)
    if (selectedManager) {
      dispatch(fetchManagerDetails(selectedManager.id));
    }
  };

  const handleCloseEngineerDialog = () => {
    setIsAssignEngineerDialogOpen(false);

    // Only refresh data if the assignment was successful (the dialog closed normally)
    if (selectedManager) {
      dispatch(fetchManagerDetails(selectedManager.id));
    }
  };

  const handleDeleteEngineerAssignment = async (engineerId: number) => {
    if (!selectedManager || !managerDetail) return;

    if (!managerDetail.engineer_assignments) return;

    if (managerDetail.engineer_assignments.length === 0) return;

    const engineerAssignment = managerDetail.engineer_assignments.find(
      (assignment) => {
        if (assignment.engineer === engineerId) {
          return assignment.id;
        }
      }
    );

    let engineerAssignmentId = engineerAssignment?.id;

    setIsDeletingEngineerAssignment(true);
    setDeletingEngineerId(engineerId);

    try {
      await apiClient.delete(`/api/admin/assignments/${engineerAssignmentId}/`);
      toast.success('Engineer assignment deleted successfully');

      // Refresh manager details after deletion
      dispatch(fetchManagerDetails(selectedManager.id));
    } catch (error) {
      console.error('Error deleting engineer assignment:', error);
      toast.error('Failed to delete engineer assignment');
    } finally {
      setIsDeletingEngineerAssignment(false);
      setDeletingEngineerId(null);
    }
  };

  const handleDeleteMeterAssignment = async (meterId: number) => {
    if (!selectedManager || !managerDetail) return;

    if (!managerDetail.meter_assignments) return;

    if (managerDetail.meter_assignments.length === 0) return;

    const meterAssignment = managerDetail.meter_assignments.find((meter) => {
      if (meter.meter === meterId) {
        return meter.id;
      }
    });

    let meterAssignmentId = meterAssignment?.id;

    setIsDeletingMeterAssignment(true);
    setDeletingMeterId(meterId);

    try {
      await apiClient.delete(
        `/api/admin/meter-assignments/${meterAssignmentId}/`
      );
      toast.success('Meter assignment deleted successfully');

      // Refresh manager details after deletion
      dispatch(fetchManagerDetails(selectedManager.id));
    } catch (error) {
      console.error('Error deleting meter assignment:', error);
      toast.error('Failed to delete meter assignment');
    } finally {
      setIsDeletingMeterAssignment(false);
      setDeletingMeterId(null);
    }
  };

  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        {selectedManager && (
          <DialogContent className="bg-gray-800 border border-gray-700 text-(--text-primary) max-h-[90vh] overflow-y-auto no-scrollbar">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-(--text-primary)">
                Manager Details
              </DialogTitle>
              <DialogDescription className="text-(--text-secondary)">
                View and manage details for {selectedManager.first_name}{' '}
                {selectedManager.last_name}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 my-2">
              {/* Manager Info Card */}
              <div className="bg-gray-800 p-2 rounded-lg border border-gray-700 shadow-md">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 truncate">
                  <div className="space-y-1">
                    <p className="text-(--text-secondary) text-sm font-medium">
                      Username
                    </p>
                    <p className="text-(--text-primary) text-sm font-semibold">
                      {selectedManager.username}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-(--text-secondary) text-sm font-medium">
                      Email
                    </p>
                    <p className="text-(--text-primary) text-sm font-semibold">
                      {selectedManager.email}
                    </p>
                  </div>
                </div>
              </div>

              {isLoading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="w-10 h-10 border-4 border-transparent rounded-full animate-spin border-t-accent-color"></div>
                  <span className="ml-3 text-(--text-secondary)">
                    Loading assignments...
                  </span>
                </div>
              ) : managerDetail ? (
                <div className="mt-6">
                  {/* Tabs Navigation */}
                  <div className="flex mb-3">
                    <button
                      className={`py-1 px-5 font-medium transition-colors ${
                        activeTab === 'meter'
                          ? 'bg-(--color-bg-accent) text-(--color-text-secondary) border-b-2 border-(--color-border-accent-hover)'
                          : 'text-(--text-secondary) bg-transparent hover:text-(--text-primary)'
                      }`}
                      onClick={() => setActiveTab('meter')}
                    >
                      Meters
                    </button>
                    <button
                      className={`py-1 px-5 font-medium transition-colors ${
                        activeTab === 'engineer'
                          ? 'bg-(--color-bg-accent) text-(--color-text-secondary) border-b-2 border-(--color-border-accent-hover)'
                          : 'text-(--text-secondary) bg-transparent hover:text-(--text-primary)'
                      }`}
                      onClick={() => setActiveTab('engineer')}
                    >
                      Engineers
                    </button>
                  </div>

                  {activeTab === 'meter' && (
                    <div className="bg-gray-800 rounded-lg border border-gray-700 shadow-md">
                      <div className="overflow-x-auto">
                        {managerDetail.meters &&
                        managerDetail.meters.length > 0 ? (
                          <div className="min-w-full max-h-[200px] no-scrollbar overflow-y-auto">
                            <table className="w-full">
                              <thead>
                                <tr className="border-b border-gray-700">
                                  <th className="text-left py-3 px-4 text-(--text-secondary) font-medium">
                                    ID
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
                                {managerDetail.meters.map(
                                  (meter: GetMeters) => (
                                    <tr
                                      key={meter.id}
                                      className="border-b border-gray-700 last:border-b-0 hover:bg-gray-800 transition-colors rounded-b-lg "
                                    >
                                      <td className="py-3 px-4 text-(--text-primary)">
                                        {meter.device_id}
                                      </td>
                                      <td className="py-3 px-4 text-(--text-primary)">
                                        {meter.location}
                                      </td>
                                      <td className="py-3 px-4 ">
                                        <HoverName title="Unassign Meter">
                                          <Button
                                            className="bg-(--color-bg-accent) text-(--color-text-secondary) border border-(--color-border-secondary) hover:border-(--color-bg-accent) hover:bg-transparent hover:text-(--color-bg-accent)"
                                            onClick={() =>
                                              handleDeleteMeterAssignment(
                                                meter.id
                                              )
                                            }
                                          >
                                            {isDeletingMeterAssignment &&
                                            deletingMeterId === meter.id ? (
                                              <Loader2 className="size-4 animate-spin" />
                                            ) : (
                                              <TrashIcon className="size-4" />
                                            )}
                                          </Button>
                                        </HoverName>
                                      </td>
                                    </tr>
                                  )
                                )}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <div className=" bg-gray-800 rounded-lg text-center py-8 text-(--text-secondary) flex flex-col items-center">
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
                            <p>No meter assignments found.</p>
                            <button className="mt-4 px-4 py-2 bg-(--color-bg-accent) hover:bg-(--color-bg-accent-hover) text-(--color-text-secondary) rounded-md transition-colors text-sm">
                              Assign New Meter
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {activeTab === 'engineer' && (
                    <div className="bg-gray-800 rounded-lg border border-gray-700 shadow-md">
                      <div className="overflow-x-auto">
                        {managerDetail &&
                        managerDetail.engineers &&
                        managerDetail.engineers.length > 0 ? (
                          <div className="min-w-full max-h-[200px] no-scrollbar overflow-y-auto">
                            <table className="w-full">
                              <thead>
                                <tr className="border-b border-gray-700">
                                  <th className="text-left py-3 px-4 text-(--text-secondary) font-medium">
                                    ID
                                  </th>
                                  <th className="text-left py-3 px-4 text-(--text-secondary) font-medium">
                                    Username
                                  </th>
                                  <th className="text-left py-3 px-4 text-(--text-secondary) font-medium">
                                    Action
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {managerDetail.engineers.map(
                                  (engineer: Engineer) => (
                                    <tr
                                      key={engineer.id}
                                      className="border-b border-gray-700 last:border-b-0 hover:bg-gray-800 transition-colors border-b-lg"
                                    >
                                      <td className="py-3 px-4 text-(--text-primary)">
                                        {engineer.id}
                                      </td>
                                      <td className="py-3 px-4 text-(--text-primary)">
                                        {engineer.username}
                                      </td>
                                      <td className="py-3 px-4 ">
                                        <HoverName title="Unassign Engineer">
                                          <Button
                                            className="bg-(--color-bg-accent) text-(--color-text-secondary) border border-(--color-border-secondary) hover:border-(--color-bg-accent) hover:bg-transparent hover:text-(--color-bg-accent)"
                                            onClick={() =>
                                              handleDeleteEngineerAssignment(
                                                engineer.id
                                              )
                                            }
                                          >
                                            {isDeletingEngineerAssignment &&
                                            deletingEngineerId ===
                                              engineer.id ? (
                                              <Loader2 className="size-4 animate-spin" />
                                            ) : (
                                              <TrashIcon className="size-4" />
                                            )}
                                          </Button>
                                        </HoverName>
                                      </td>
                                    </tr>
                                  )
                                )}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <div className=" bg-gray-800 rounded-lg text-center py-8 text-(--text-secondary) flex flex-col items-center">
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
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                              />
                            </svg>
                            <p>No engineer assignments found.</p>
                            <button className="mt-4 px-4 py-2 bg-(--color-bg-accent) hover:bg-(--color-bg-accent-hover) text-(--color-text-secondary) rounded-md transition-colors text-sm">
                              Assign New Engineer
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="mt-6 p-8 bg-(--surface-dark) rounded-lg border border-gray-700 text-center text-(--text-secondary)">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16 mx-auto text-gray-600 mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 2a10 10 0 110 20 10 10 0 010-20z"
                    />
                  </svg>
                  <p>No data found.</p>
                </div>
              )}
            </div>

            <DialogFooter className="flex space-x-4">
              <HoverName title="Assign Engineer">
                <Button
                  variant="outline"
                  className="bg-transparent text-(--color-text-primary) border border-(--color-text-primary) hover:border-(--color-border-accent) hover:bg-(--color-bg-accent-hover) hover:text-(--color-text-secondary)"
                  onClick={handleAssignEngineer}
                >
                  <PlusIcon className="size-3" />
                  <UserPlusIcon className="size-4" />
                </Button>
              </HoverName>

              <HoverName title="Assign Meter">
                <Button
                  variant="outline"
                  className="bg-(--color-bg-accent) text-(--color-text-secondary) border border-(--color-bg-accent-hover) (--color-text-secondary) hover:border-(--color-bg-accent) hover:bg-(--color-bg-accent-hover)"
                  onClick={handleAssignMeter}
                >
                  <PlusIcon className="size-3" />
                  <GaugeIcon className="size-4" />
                </Button>
              </HoverName>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>

      {selectedManager && (
        <>
          <AssignMeterDialog
            isOpen={isAssignMeterDialogOpen}
            onClose={handleCloseMeterDialog}
            manager={selectedManager}
          />
          <AssignEngineerDialog
            isOpen={isAssignEngineerDialogOpen}
            onClose={handleCloseEngineerDialog}
            manager={selectedManager}
          />
        </>
      )}
    </>
  );
}
