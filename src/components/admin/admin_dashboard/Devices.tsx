import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addDevice, fetchDeviceData, fetchMeters } from "@/store/slices/admin/adminThunks";
import { RootState, AppDispatch } from "@/store";
import { PlusIcon, SearchIcon } from "lucide-react";
import AddDialogBox from "./AddDialogBox";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const addDeviceSchema = z.object({
  device_id: z.coerce
    .number()
    .min(1, "Device ID is required and must be a number"),
  location: z.string().min(1, "Location is required"),
});

type FormValues = z.infer<typeof addDeviceSchema>;

export default function Devices() {
  const dispatch = useDispatch<AppDispatch>();
  const { get_meters } = useSelector((state: RootState) => state.admin);
  const [isAddDeviceOpen, setIsAddDeviceOpen] = useState(false);
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredMeters, setFilteredMeters] = useState(get_meters);
  const navigate = useNavigate();

  const form = useForm<FormValues>({
    resolver: zodResolver(addDeviceSchema),
    defaultValues: {
      device_id: 0,
      location: "",
    },
  });

  useEffect(() => {
    dispatch(fetchMeters());
  }, [dispatch, location.key]);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredMeters(get_meters);
    } else {
      const lowercaseSearchTerm = searchTerm.toLowerCase();
      const filtered = get_meters.filter(
        (meter) =>
          meter.device_id.toString().includes(searchTerm) ||
          meter.location.toLowerCase().includes(lowercaseSearchTerm)
      );
      setFilteredMeters(filtered);
    }
  }, [searchTerm, get_meters]);

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = (values: FormValues) => {
    setIsLoading(true);
    dispatch(addDevice(values));
    setIsAddDeviceOpen(false);
    form.reset();
    setIsLoading(false);
  };

  const handleAddDevice = () => {
    setIsAddDeviceOpen(true);
  };

  const handleDeviceClick = (device_id: number, id: number) => {
    console.log("Device ID clicked:", device_id);
    // We should pass device_id to fetchDeviceData, not id
    dispatch(fetchDeviceData(id))
      .unwrap()
      .then(() => {
        navigate(`/admin/dashboard/${device_id}`);
      })
      .catch((error) => {
        console.error("Failed to fetch device data:", error);
      });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Devices</h1>

        <div className="flex items-center gap-2">
          <div className="relative w-64">
            <input
              type="text"
              placeholder="Search by ID or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          </div>

          <button
            className="bg-(--color-bg-accent) text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-(--color-bg-accent-hover) transition-colors"
            onClick={() => handleAddDevice()}
          >
            <PlusIcon className="w-4 h-4" />
            Add
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMeters.length > 0 ? (
          filteredMeters.map((meter) => (
            <div
              key={meter.id}
              onClick={() => handleDeviceClick( meter.device_id, meter.id)}
              className="cursor-pointer bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <div className="flex flex-col">
                <span className="font-semibold text-lg ">
                  Device ID: {meter.device_id}
                </span>
                <span className="text-sm text-gray-400">
                  Location: {meter.location}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-3 text-center py-8">No devices found</div>
        )}
      </div>

      <AddDialogBox
        isAddDeviceOpen={isAddDeviceOpen}
        setIsAddDeviceOpen={setIsAddDeviceOpen}
        form={form}
        onSubmit={onSubmit}
        isLoading={isLoading}
      />
    </div>
  );
}
