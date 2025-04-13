import { Button } from "@/components/ui/button";
import ReactSpeedometer, { Transition } from "react-d3-speedometer";
import { Loader2Icon, Trash2Icon } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { deleteDevice } from "@/store/slices/admin/adminThunks";
import { AppDispatch, RootState } from "@/store";
import { useNavigate, useParams } from "react-router-dom";

export default function DeviceDetails() {
  const { slug } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const isLoading = useSelector((state: RootState) => state.admin.isLoading);

  const handleDeleteDevice = () => {
    if (slug) {
      dispatch(deleteDevice(parseInt(slug)))
        .unwrap()
        .then(() => {
          navigate("/dashboard");
        })
        .catch((error) => {
          console.error("Failed to delete device:", error);
        });
    }
  };

  return (
    <div className="flex flex-col relative h-[calc(100vh-3rem)] ">
      <div className=" h-12 absolute bottom-0 right-0 left-0 flex bg-secondary rounded-t-md justify-center items-center px-2 border border-primary ">
        <Button variant={"default"} className="flex-1 mr-2">
          Engine
        </Button>
        <Button variant={"default"} className="flex-1 mr-2">
          Generator
        </Button>
        <Button variant={"default"} className="flex-1">
          Alarms
        </Button>
      </div>

      <div className="flex-1 overflow-auto px-4 no-scrollbar mb-14 ">
        <div className="flex flex-col gap-6">
          <div className="flex gap-4 items-center justify-between">
            <h1 className="text-2xl font-bold">Speedometer</h1>
            <Button
              variant={"outline"}
              className=" text-red-500 hover:text-red-600 bg-transparent hover:bg-transparent"
              onClick={handleDeleteDevice}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2Icon className="size-6 animate-spin" />
              ) : (
                <Trash2Icon className="size-6" />
              )}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Speed Meter */}
            <div className=" rounded-lg shadow-md p-4 flex flex-col items-center bg-transparent text-secondary ">
              <h3 className="text-lg font-semibold mb-2">Speed (KM/h)</h3>
              <ReactSpeedometer
                maxValue={220}
                value={120}
                needleColor="red"
                startColor="green"
                endColor="red"
                segments={10}
                ringWidth={25}
                needleHeightRatio={0.7}
                needleTransition={Transition.easeElasticIn}
                currentValueText="${value} KM/h"
              />
            </div>

            {/* RPM Meter */}
            <div className=" rounded-lg shadow-md p-4 flex flex-col items-center bg-secondary text-primary">
              <h3 className="text-lg font-semibold mb-2">RPM (x1000)</h3>
              <ReactSpeedometer
                maxValue={8}
                value={3.5}
                needleColor="#a7ff83"
                startColor="green"
                endColor="#ff5757"
                segments={8}
                ringWidth={25}
                needleHeightRatio={0.7}
                needleTransition={Transition.easeQuadInOut}
                currentValueText="${value}K RPM"
              />
            </div>

            {/* Fuel Gauge */}
            <div className=" rounded-lg shadow-md p-4 flex flex-col items-center bg-secondary text-primary">
              <h3 className="text-lg font-semibold mb-2">Fuel Level</h3>
              <ReactSpeedometer
                maxValue={100}
                value={65}
                needleColor="#5d5d5d"
                startColor="#ff5757"
                endColor="green"
                segments={5}
                ringWidth={25}
                needleHeightRatio={0.7}
                needleTransition={Transition.easeElasticIn}
                currentValueText="${value}%"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
