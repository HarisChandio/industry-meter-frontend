import { Button } from "@/components/ui/button";
import ReactSpeedometer, { Transition } from "react-d3-speedometer";
import { Loader2Icon, Trash2Icon } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { deleteDevice, generateAlarmMeterReport, generateMeterReport } from "@/store/slices/admin/adminThunks";
import { AppDispatch, RootState } from "@/store";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { StatusIconGrid } from "@/components/common/StatusIcons";
import { current } from "@reduxjs/toolkit";
import { DeviceData } from "@/store/slices/admin/adminTypes";
import { toast } from "sonner";

// Reusable Header Stats component to show the meter UI
function HeaderStats(deviceData: DeviceData) {
  console.log("Header Stats Data:", deviceData);
  console.log(deviceData?.power_percentage, "power percentage");

  return (
    <div className="bg-surface-dark p-2 rounded-md shadow-md">
      <div className="flex items-center justify-between overflow-x-auto">
        {/* First column */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between text-sm">
            <span className="text-accent-color">{deviceData?.frequency_hz || 0} Hz</span>
            <span className="text-chart-1">49.9 Hz</span>
          </div>
          <div className="h-1 w-full bg-background-dark mt-2 mb-4">
            <div className="h-full bg-accent-color w-1/3"></div>
          </div>
          <div className="flex justify-between">
            <span className="text-accent-color">kW</span>
            <span className="text-accent-color">{deviceData?.deviceData?.power_percentage || 0} %</span>
          </div>
          <div className="flex justify-between">
            <span className="text-accent-color">MW</span>
            <span className="text-accent-color">{deviceData?.deviceData?.power_percentage || 0} %</span>
          </div>
        </div>

        {/* Second column */}
        <div className="flex mx-4">
          <div className="flex flex-col">
            <span className="text-chart-3 text-xl font-bold">52.9 kW</span>
            <span className="text-chart-3">56.5 kWh</span>
            <span className="text-chart-3">19.8 kVAr</span>
            <span className="text-chart-3">0.93 pf</span>
          </div>
        </div>

        {/* Third column */}
        <div className="flex">
          <div className="flex flex-col">
            <span className="text-chart-3 text-xl font-bold">{deviceData?.deviceData?.phase_a_voltage_v} V Ph-1</span>
            <span className="text-chart-3">{deviceData?.deviceData?.phase_a_current_a} Amp</span>
          </div>
        </div>
        <div className="flex">
          <div className="flex flex-col">
            <span className="text-chart-3 text-xl font-bold">{deviceData?.deviceData?.phase_b_voltage_v} V Ph-2</span>
            <span className="text-chart-3">{deviceData?.deviceData?.phase_b_current_a} Amp</span>
          </div>
        </div>
        <div className="flex">
          <div className="flex flex-col">
            <span className="text-chart-3 text-xl font-bold">{deviceData?.deviceData?.phase_c_voltage_v} V Ph-1</span>
            <span className="text-chart-3">{deviceData?.deviceData?.phase_c_current_a} Amp</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DeviceDetails() {
  const { slug } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const isLoading = useSelector((state: RootState) => state.admin.isLoading);

  const [activeTab, setActiveTab] = useState<"engine" | "generator" | "alarms">("engine");
  const { currentDeviceData } = useSelector((state: RootState) => state.admin);
  console.log("Current Device Data:", currentDeviceData);

  const handleDeleteDevice = () => {
    if (slug) {
      const deviceId = slug.includes('/') ? slug.split('/').pop() : slug;
      console.log("Extracted device ID:", deviceId);
      dispatch(deleteDevice((deviceId || slug) as string))
        .unwrap()
        .then(() => {
          navigate("/admin/dashboard");
        })
        .catch((error) => {
          console.error("Failed to delete device:", error);
        });
    }
  };

  const handleGenerateReport = () => {
    if (slug) {
      // Log the full slug value for debugging
      console.log("Generating report for device:", slug);

      // If the slug contains additional path segments (like 'dashboard/generator')
      // Extract just the device ID part if needed
      const deviceId = slug.includes('/') ? slug.split('/').pop() : slug;
      console.log("Extracted device ID:", deviceId);

      dispatch(generateMeterReport({
        meter_id: deviceId || slug,
        time_range: "last_24",
      }))
        .unwrap()
        .then(() => {
          console.log("Report generated successfully");
        })
        .catch((error) => {
          console.error("Failed to generate report:", error);
        });
    }
  };

  return (
    <div className="flex flex-col relative h-[calc(100vh-3rem)] bg-background-dark text-text-primary">
      <div className="h-12 absolute bottom-0 right-0 left-0 flex bg-surface-dark rounded-t-md justify-center items-center px-2 border border-accent-color">
        <Button
          variant={activeTab === "engine" ? "default" : "secondary"}
          className={cn(
            "flex-1 mr-2",
            activeTab === "engine"
              ? "bg-(--color-bg-accent) text-(--color-text-secondary) hover:bg-(--color-bg-accent-hover)"
              : "bg-(--color-bg-secondary) text-(--color-text-primary) hover:bg-(--color-bg-secondary-hover)"
          )}
          onClick={() => setActiveTab("engine")}
        >
          Engine
        </Button>
        <Button
          variant={activeTab === "generator" ? "default" : "secondary"}
          className={cn(
            "flex-1 mr-2",
            activeTab === "generator"
              ? "bg-(--color-bg-accent) text-(--color-text-secondary) hover:bg-(--color-bg-accent-hover)"
              : "bg-(--color-bg-secondary) text-(--color-text-primary) hover:bg-(--color-bg-secondary-hover)"
          )}
          onClick={() => setActiveTab("generator")}
        >
          Generator
        </Button>
        <Button
          variant={activeTab === "alarms" ? "default" : "secondary"}
          className={cn(
            "flex-1",
            activeTab === "alarms"
              ? "bg-(--color-bg-accent) text-(--color-text-secondary) hover:bg-(--color-bg-accent-hover)"
              : "bg-(--color-bg-secondary) text-(--color-text-primary) hover:bg-(--color-bg-secondary-hover)"
          )}
          onClick={() => setActiveTab("alarms")}
        >
          Alarms
        </Button>
      </div>

      <div className="flex-1 overflow-auto px-4 no-scrollbar mb-14">
        {activeTab === "engine" && (
          <EngineTab
            onDeleteDevice={handleDeleteDevice}
            isLoading={isLoading}
            deviceData={currentDeviceData}
            onGenerateReport={handleGenerateReport}
          />
        )}
        {activeTab === "generator" && <GeneratorTab deviceData={currentDeviceData}/>}
        {activeTab === "alarms" && <AlarmsTab deviceData={currentDeviceData} />}
      </div>
    </div>
  );
}

interface TabProps {
  onDeleteDevice?: () => void;
  isLoading?: boolean;
  deviceData?: DeviceData;
  onGenerateAlarmReport?: () => void;
  onGenerateReport?: () => void;
}

function EngineTab({ onDeleteDevice, isLoading, deviceData, onGenerateReport }: TabProps) {
  return (
    <div className="flex flex-col gap-6 py-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-accent-color">Manual Mode</h1>
        </div>
        {onGenerateReport && (
          <Button
            variant="outline"
            className="text-accent-color hover:text-accent-hover bg-transparent hover:bg-surface-dark border-accent-color"
            onClick={onGenerateReport}
            disabled={isLoading}
          >
            Report
          </Button>
        )}
        {onDeleteDevice && (
          <Button
            variant="outline"
            className="text-destructive hover:text-destructive/90 bg-transparent hover:bg-surface-dark border-accent-color"
            onClick={onDeleteDevice}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2Icon className="size-6 animate-spin" />
            ) : (
              <Trash2Icon className="size-6" />
            )}
          </Button>
        )}
      </div>

      {/* Header stats */}
      <HeaderStats deviceData={deviceData} />

      {/* Control Icons - Replacing with StatusIconGrid */}
      <StatusIconGrid />

      {/* Main gauges */}
      <div className="flex flex-wrap gap-4">
        {/* RPM Gauge */}
        <div className="md:col-span-1 rounded-lg p-2 flex flex-col items-center shadow-md">
          <div className="w-full h-full">
            <ReactSpeedometer
              width={window.innerWidth < 768 ? 150 : 280}
              height={150}
              maxValue={3000}
              value={deviceData?.rpm || 0}
              needleColor="#BB86FC"
              startColor="#3A3A3A"
              endColor="#3A3A3A"
              segments={30}
              ringWidth={20}
              needleHeightRatio={0.7}
              needleTransition={Transition.easeQuadInOut}
              currentValueText=""
              segmentColors={Array(30).fill("#3A3A3A")}
              textColor="#BB86FC"
              customSegmentLabels={Array(30)
                .fill(0)
                .map((_, i) => {
                  if (i % 3 === 0) {
                    return {
                      text: `${i}`,
                      position: "INSIDE" as any,
                      color: "#FFFFFF",
                      fontSize: "10px",
                    };
                  }
                  return {
                    text: "",
                    position: "INSIDE" as any,
                    color: "#FFFFFF",
                    fontSize: "0px",
                  };
                })}
            />
          </div>
          <span className="text-chart-3 text-xl font-bold">{deviceData?.rpm} RPM</span>
          <div className="mt-2 bg-background-dark border border-text-secondary p-1 px-2 rounded">
            <span className="text-text-primary text-xs">{deviceData?.engine_hours} hrs</span>
          </div>
          <div className="mt-3 flex flex-col text-xs">
            <div className="flex justify-between w-full">
              <span className="text-text-secondary">Engine Starts</span>
              <span className="text-text-primary">{deviceData?.engine_hours}</span>
            </div>
            <div className="flex justify-between w-full">
              <span className="text-text-secondary">Fuel Consumption</span>
              <span className="text-text-primary">{deviceData?.fuel_rate_lph} L/hr</span>
            </div>
            <div className="flex justify-between w-full">
              <span className="text-text-secondary">Fuel Used</span>
              <span className="text-text-primary">{deviceData?.fuel_level_percent} %</span>
            </div>
          </div>
        </div>

        {/* Four gauge cluster */}
        <div className="md:col-span-4 grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {/* Oil Pressure Gauge */}
          <div className="bg-surface-dark rounded-lg p-2 flex flex-col justify-center items-center shadow-md">
            <div className="w-full flex justify-center">
              <ReactSpeedometer
                width={window.innerWidth < 768 ? 200 : 160}
                height={window.innerWidth < 768 ? 120 : 100}
                maxValue={1000}
                value={deviceData?.oil_pressure_kpa || 0}
                needleColor="#FF5252"
                startColor="#2E2E2E"
                endColor="#2E2E2E"
                segments={5}
                ringWidth={15}
                needleHeightRatio={0.7}
                currentValueText=""
                textColor="#FFFFFF"
              />
            </div>
            <span className="text-text-primary text-sm">{deviceData?.oil_pressure_kpa} kPA</span>
            <span className="text-text-secondary text-xs">Oil Press</span>
          </div>

          {/* Coolant Temp Gauge */}
          <div className="bg-surface-dark rounded-lg p-2 flex flex-col justify-center items-center shadow-md">
            <div className="w-full flex justify-center">
              <ReactSpeedometer
                width={window.innerWidth < 768 ? 200 : 160}
                height={window.innerWidth < 768 ? 120 : 100}
                maxValue={120}
                value={deviceData?.coolant_temp_c || 0}
                needleColor="#FF5252"
                startColor="#2E2E2E"
                endColor="#2E2E2E"
                segments={5}
                ringWidth={15}
                needleHeightRatio={0.7}
                currentValueText=""
                textColor="#FFFFFF"
              />
            </div>
            <span className="text-text-primary text-sm">{deviceData?.coolant_temp_c} °C</span>
            <span className="text-text-secondary text-xs">Coolant Temp</span>
          </div>

          {/* Battery Voltage */}
          <div className="bg-surface-dark rounded-lg p-2 flex flex-col justify-center items-center shadow-md">
            <div className="w-full flex justify-center">
              <ReactSpeedometer
                width={window.innerWidth < 768 ? 200 : 160}
                height={window.innerWidth < 768 ? 120 : 100}
                maxValue={30}
                value={deviceData?.battery_voltage_v || 0}
                needleColor="#FF5252"
                startColor="#2E2E2E"
                endColor="#2E2E2E"
                segments={5}
                ringWidth={15}
                needleHeightRatio={0.7}
                currentValueText=""
                textColor="#FFFFFF"
              />
            </div>
            <span className="text-text-primary text-sm">{deviceData?.battery_voltage_v} VDC</span>
            <span className="text-text-secondary text-xs">Battery</span>
          </div>

          {/* Charge Current */}
          <div className="bg-surface-dark rounded-lg p-2 flex flex-col justify-center items-center shadow-md">
            <div className="w-full flex justify-center">
              <ReactSpeedometer
                width={window.innerWidth < 768 ? 200 : 160}
                height={window.innerWidth < 768 ? 120 : 100}
                maxValue={50}
                value={27.7}
                needleColor="#FF5252"
                startColor="#2E2E2E"
                endColor="#2E2E2E"
                segments={5}
                ringWidth={15}
                needleHeightRatio={0.7}
                currentValueText=""
                textColor="#FFFFFF"
              />
            </div>
            <span className="text-text-primary text-sm">27.7 VDC</span>
            <span className="text-text-secondary text-xs">Charge</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function GeneratorTab(deviceData: DeviceData) {
  return (
    <div className="flex flex-col gap-6 py-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-accent-color">Manual Mode</h1>
        </div>
      </div>

      {/* Header stats */}
      <HeaderStats deviceData= {deviceData}/>

      {/* Control Icons */}
      {/* <StatusIconGrid /> */}

      {/* Voltage Output */}
      <div className="bg-surface-dark p-4 rounded-lg border border-text-secondary shadow-md">
        <h2 className="text-lg font-semibold mb-4 text-accent-color">Voltage Output</h2>
        <div className="grid grid-cols-4 gap-4">
          <div className="flex flex-col items-center">
            <ReactSpeedometer
              maxValue={500}
              value={415}
              needleColor="#BB86FC"
              startColor="#2E2E2E"
              endColor="#2E2E2E"
              segments={5}
              ringWidth={15}
              needleHeightRatio={0.7}
              currentValueText=""
              width={120}
              height={120}
            />
            <span className="text-text-primary mt-2">415 V (L1)</span>
          </div>
          <div className="flex flex-col items-center">
            <ReactSpeedometer
              maxValue={500}
              value={412}
              needleColor="#BB86FC"
              startColor="#2E2E2E"
              endColor="#2E2E2E"
              segments={5}
              ringWidth={15}
              needleHeightRatio={0.7}
              currentValueText=""
              width={120}
              height={120}
            />
            <span className="text-text-primary mt-2">412 V (L2)</span>
          </div>
          <div className="flex flex-col items-center">
            <ReactSpeedometer
              maxValue={500}
              value={418}
              needleColor="#BB86FC"
              startColor="#2E2E2E"
              endColor="#2E2E2E"
              segments={5}
              ringWidth={15}
              needleHeightRatio={0.7}
              currentValueText=""
              width={120}
              height={120}
            />
            <span className="text-text-primary mt-2">418 V (L3)</span>
          </div>
          <div className="flex flex-col items-center">
            <ReactSpeedometer
              maxValue={500}
              value={418}
              needleColor="#BB86FC"
              startColor="#2E2E2E"
              endColor="#2E2E2E"
              segments={5}
              ringWidth={15}
              needleHeightRatio={0.7}
              currentValueText=""
              width={120}
              height={120}
            />
            <span className="text-text-primary mt-2">418 V (L3)</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function AlarmsTab({ deviceData }: TabProps) {
  console.log("Alarms Tab Data:", deviceData);
  const dispatch = useDispatch<AppDispatch>();
  const isLoading = useSelector((state: RootState) => state.admin.isLoading);
  const { slug } = useParams();

  const alarms = [
    {
      id: 1,
      timestamp: "2023-05-15 08:23:15",
      type: "Warning",
      message: "Low Fuel Level",
      status: "Active",
    },
    {
      id: 2,
      timestamp: "2023-05-14 14:45:32",
      type: "Critical",
      message: "High Engine Temperature",
      status: "Resolved",
    },
    {
      id: 3,
      timestamp: "2023-05-14 09:12:45",
      type: "Info",
      message: "Maintenance Required",
      status: "Active",
    },
    {
      id: 4,
      timestamp: "2023-05-13 22:34:18",
      type: "Warning",
      message: "Battery Voltage Low",
      status: "Active",
    },
    {
      id: 5,
      timestamp: "2023-05-12 16:09:23",
      type: "Critical",
      message: "Emergency Stop Activated",
      status: "Resolved",
    },
  ];

  const handleGenerateAlarmReport = () => {
    console.log("Generating alarm report...");
    console.log("Device Data:", deviceData);
    const deviceId = slug.includes('/') ? slug.split('/').pop() : slug;
      console.log("Extracted device ID:", deviceId);


    if (deviceData) {
      dispatch(
        generateAlarmMeterReport({
          meter_id:deviceId || slug,
          time_range: "last_24",
        })
      )
        .unwrap()
        .then(() => {
          console.log("Alarm report generated successfully");
        })
        .catch((error) => {
          console.error("Failed to generate alarm report:", error);
        });
    } else {
      toast.error("No device data available for report generation");
    }
  };

  return (
    <div className="flex flex-col gap-6 py-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-accent-color">Manual Mode</h1>
        </div>
      </div>

      {/* Header stats */}
      <HeaderStats deviceData={deviceData} />

      {/* Control Icons */}
      {/* <StatusIconGrid /> */}

      <div className="bg-surface-dark p-4 rounded-lg border border-text-secondary shadow-md">
        <div className="grid grid-cols-12 gap-4 border-b border-text-secondary pb-2 mb-2 font-semibold text-accent-color">
          <div className="col-span-1">#</div>
          <div className="col-span-3">Timestamp</div>
          <div className="col-span-2">Type</div>
          <div className="col-span-4">Message</div>
          <div className="col-span-2">Status</div>
        </div>

        {alarms.map((alarm) => (
          <div
            key={alarm.id}
            className="grid grid-cols-12 gap-4 py-3 border-b border-text-secondary/30 text-sm"
          >
            <div className="col-span-1 text-text-secondary">{alarm.id}</div>
            <div className="col-span-3 text-text-primary">{alarm.timestamp}</div>
            <div
              className={`col-span-2 font-medium ${
                alarm.type === "Critical"
                  ? "text-destructive"
                  : alarm.type === "Warning"
                  ? "text-chart-3"
                  : "text-accent-color"
              }`}
            >
              {alarm.type}
            </div>
            <div className="col-span-4 text-text-primary">{alarm.message}</div>
            <div
              className={`col-span-2 font-medium ${
                alarm.status === "Active" ? "text-destructive" : "text-chart-1"
              }`}
            >
              {alarm.status}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-surface-dark p-4 rounded-lg border border-text-secondary shadow-md">
          <h2 className="text-lg font-semibold mb-4 text-accent-color">
            Alarm Statistics
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-text-secondary">Total Alarms:</span>
              <span className="text-text-primary">5</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Active Alarms:</span>
              <span className="text-destructive">3</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Critical Alarms:</span>
              <span className="text-destructive">2</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Warnings:</span>
              <span className="text-chart-3">2</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Info:</span>
              <span className="text-accent-color">1</span>
            </div>
          </div>
        </div>

        <div className="bg-surface-dark p-4 rounded-lg border border-text-secondary shadow-md">
          <h2 className="text-lg font-semibold mb-4 text-accent-color">
            Quick Actions
          </h2>
          <div className="space-y-4">
            <Button className="w-full bg-destructive hover:bg-destructive/90">
              Reset All Alarms
            </Button>
            <Button
              className="w-full bg-accent-color hover:bg-accent-hover"
              onClick={() => handleGenerateAlarmReport()}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                  Generating Report...
                </>
              ) : (
                "Generate Alarm Report"
              )}
            </Button>
            <Button className="w-full bg-chart-1 hover:bg-chart-1/90">
              Configure Alarm Settings
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
