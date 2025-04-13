import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { Dialog } from "../ui/dialog";
import {
  Manager as ManagerType,
  MeterAssignment,
  EngineerAssignment,
} from "../../store/slices/admin/adminTypes";
import { PlusIcon, GaugeIcon, UserPlusIcon } from "lucide-react";
import { Button } from "../ui/button";
import { useState, useEffect } from "react";
import AssignMeterDialog from "./AssignMeterDialog";
import AssignEngineerDialog from "./AssignEngineerDialog";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { fetchManagerDetails } from "../../store/slices/admin/adminThunks";
import { RootState } from "../../store";

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
  const [activeTab, setActiveTab] = useState<"meter" | "engineer">("meter");

  useEffect(() => {
    if (isDialogOpen && selectedManager) {
      dispatch(fetchManagerDetails(selectedManager.id));
    }
  }, [isDialogOpen, selectedManager, dispatch]);

  const handleAssignMeter = () => {
    setIsAssignMeterDialogOpen(true);
  };

  const handleAssignEngineer = () => {
    setIsAssignEngineerDialogOpen(true);
  };

  const handleCloseMeterDialog = () => {
    setIsAssignMeterDialogOpen(false);
    // Refresh manager details after assigning a meter
    if (selectedManager) {
      dispatch(fetchManagerDetails(selectedManager.id));
    }
  };

  const handleCloseEngineerDialog = () => {
    setIsAssignEngineerDialogOpen(false);
    // Refresh manager details after assigning an engineer
    if (selectedManager) {
      dispatch(fetchManagerDetails(selectedManager.id));
    }
  };

  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        {selectedManager && (
          <DialogContent className="bg-(--surface-dark) border border-gray-700 text-(--text-primary) max-h-[90vh] overflow-y-auto no-scrollbar">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-(--text-primary)">
                Manager Details
              </DialogTitle>
              <DialogDescription className="text-(--text-secondary)">
                View and manage details for {selectedManager.first_name}{" "}
                {selectedManager.last_name}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 my-2">
              {/* Manager Info Card */}
              <div className="bg-(--surface-dark) p-2 rounded-lg border border-gray-700 shadow-md">
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
                        activeTab === "meter"
                          ? "text-(--text-primary) border-b-2 border-accent-color"
                          : "text-(--text-secondary) bg-transparent hover:text-(--text-primary)"
                      }`}
                      onClick={() => setActiveTab("meter")}
                    >
                      Meters
                    </button>
                    <button
                      className={`py-1 px-5 font-medium transition-colors ${
                        activeTab === "engineer"
                          ? "text-(--text-primary) border-b-2 border-accent-color"
                          : "text-(--text-secondary) bg-transparent hover:text-(--text-primary)"
                      }`}
                      onClick={() => setActiveTab("engineer")}
                    >
                      Engineers
                    </button>
                  </div>

                  {activeTab === "meter" && (
                    <div className="bg-(--surface-dark) rounded-lg border border-gray-700 shadow-md">
                      <div className="overflow-x-auto">
                        {managerDetail.assignments &&
                        managerDetail.assignments.length > 0 ? (
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
                                </tr>
                              </thead>
                              <tbody>
                                {managerDetail.assignments.map(
                                  (assignment: MeterAssignment) => (
                                    <tr
                                      key={assignment.id}
                                      className="border-b border-gray-700 last:border-b-0 hover:bg-gray-800 transition-colors"
                                    >
                                      <td className="py-3 px-4 text-(--text-primary)">
                                        {assignment.meter}
                                      </td>
                                      <td className="py-3 px-4 text-(--text-primary)">
                                        {assignment.location}
                                      </td>
                                    </tr>
                                  )
                                )}
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
                            <p>No meter assignments found.</p>
                            <button className="mt-4 px-4 py-2 bg-accent-color hover:bg-accent-hover text-white rounded-md transition-colors text-sm">
                              Assign New Meter
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {activeTab === "engineer" && (
                    <div className="bg-(--surface-dark) rounded-lg border border-gray-700 shadow-md">
                      <div className="overflow-x-auto">
                        {managerDetail &&
                        (managerDetail as any).engineer_assignments &&
                        (managerDetail as any).engineer_assignments.length >
                          0 ? (
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
                                </tr>
                              </thead>
                              <tbody>
                                {(
                                  managerDetail as any
                                ).engineer_assignments.map(
                                  (assignment: EngineerAssignment) => (
                                    <tr
                                      key={assignment.id}
                                      className="border-b border-gray-700 last:border-b-0 hover:bg-gray-800 transition-colors"
                                    >
                                      <td className="py-3 px-4 text-(--text-primary)">
                                        {assignment.engineer}
                                      </td>
                                      <td className="py-3 px-4 text-(--text-primary)">
                                        {assignment.engineer_username}
                                      </td>
                                    </tr>
                                  )
                                )}
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
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                              />
                            </svg>
                            <p>No engineer assignments found.</p>
                            <button className="mt-4 px-4 py-2 bg-accent-color hover:bg-accent-hover text-white rounded-md transition-colors text-sm">
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
              <Button
                variant="outline"
                className="bg-transparent text-text-primary border border-text-secondary hover:border-accent-color hover:bg-[#101828] hover:text-accent-hover"
                onClick={handleAssignEngineer}
              >
                <PlusIcon className="size-3" />
                <UserPlusIcon className="size-4" />
              </Button>

              <Button
                variant="outline"
                className="bg-surface-dark text-text-primary border border-text-secondary hover:border-accent-color hover:bg-[#101828] hover:text-accent-hover"
                onClick={handleAssignMeter}
              >
                <PlusIcon className="size-3" />
                <GaugeIcon className="size-4" />
              </Button>
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
