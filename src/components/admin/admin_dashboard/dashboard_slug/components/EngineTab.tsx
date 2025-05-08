import ReactSpeedometer, { Transition } from 'react-d3-speedometer';
import { StatusIconGrid } from '@/components/common/StatusIcons';
import ManualModeHeader from './ManualModeHeader';
import { TabProps } from './TabProps';

function EngineTab({
  onDeleteDevice,
  isLoading,
  deviceData,
  onGenerateReport,
}: TabProps) {
  return (
    <div className="flex flex-col gap-6 py-4">
      <ManualModeHeader
        deviceData={deviceData}
        onDeleteDevice={onDeleteDevice}
        onGenerateReport={onGenerateReport}
        isLoading={isLoading}
        showReportButton={true}
        showDeleteButton={true}
      />

      {/* Control Icons - Replacing with StatusIconGrid */}
      <StatusIconGrid />

      {/* Main gauges */}
      <div className="flex flex-row flex-wrap justify-center items-center gap-4">
        {/* RPM Gauge */}
        <div className="rounded-lg p-2 flex flex-col items-center">
          <div className="w-full h-fit flex justify-center relative">
            <ReactSpeedometer
              width={window.innerWidth < 1475 ? 290 : 380}
              height={window.innerWidth < 1475 ? 200 : 250}
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
              valueTextFontSize="0"
              segmentColors={Array(30).fill('#3A3A3A')}
              textColor="#BB86FC"
              customSegmentLabels={Array(30)
                .fill(0)
                .map((_, i) => {
                  if (i % 3 === 0) {
                    return {
                      text: `${i}`,
                      position: 'INSIDE' as any,
                      color: '#FFFFFF',
                      fontSize: '10px',
                    };
                  }
                  return {
                    text: '',
                    position: 'INSIDE' as any,
                    color: '#FFFFFF',
                    fontSize: '0px',
                  };
                })}
            />
            {/* Engine hours display */}
            <div className="absolute bottom-0 left-36 2xl:left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 px-2 py-1 rounded text-yellow-300 text-sm border border-gray-600">
              <span>{deviceData?.engine_hours}</span>
              <span className="text-xs ml-1 text-gray-300">hrs</span>
            </div>
          </div>
          <span className="mt-5 text-xl font-bold text-center">
            {deviceData?.rpm} <span className="text-blue-500">RPM</span>
          </span>
        </div>

        {/* Oil Pressure Gauge */}
        <div className="bg-surface-dark rounded-lg p-2 flex flex-col justify-center items-center">
          <div className="w-full flex justify-center">
            <ReactSpeedometer
              width={window.innerWidth < 1465 ? 110 : 110}
              height={window.innerWidth < 1465 ? 85 : 85}
              maxValue={800}
              value={deviceData?.oil_pressure_kpa || 0}
              needleColor="#FF5252"
              startColor="#2E2E2E"
              endColor="#2E2E2E"
              segments={5}
              ringWidth={15}
              needleHeightRatio={0.7}
              textColor="#FFFFFF"
            />
          </div>
          <div className="mt-0">
            <span className="text-text-secondary text-xs">
              Oil Pressure <span className="text-blue-500">kPA</span>
            </span>
          </div>
        </div>

        {/* Coolant Temp Gauge */}
        <div className="bg-surface-dark rounded-lg p-2 flex flex-col justify-center items-center">
          <div className="w-full flex justify-center">
            <ReactSpeedometer
              width={window.innerWidth < 1465 ? 110 : 110}
              height={window.innerWidth < 1465 ? 85 : 85}
              maxValue={120}
              value={deviceData?.coolant_temp_c || 0}
              needleColor="#FF5252"
              startColor="#2E2E2E"
              endColor="#2E2E2E"
              segments={5}
              ringWidth={15}
              needleHeightRatio={0.7}
              textColor="#FFFFFF"
            />
          </div>
          <div className="mt-0">
            <span className="text-text-secondary text-xs">
              Coolant Temp <span className="text-blue-500">°C</span>
            </span>
          </div>
        </div>

        {/* Battery Voltage */}
        <div className="bg-surface-dark rounded-lg p-2 flex flex-col justify-center items-center">
          <div className="w-full flex justify-center">
            <ReactSpeedometer
              width={window.innerWidth < 1465 ? 110 : 110}
              height={window.innerWidth < 1465 ? 85 : 85}
              maxValue={30}
              value={deviceData?.battery_voltage_v || 0}
              needleColor="#FF5252"
              startColor="#2E2E2E"
              endColor="#2E2E2E"
              segments={5}
              ringWidth={15}
              needleHeightRatio={0.7}
              textColor="#FFFFFF"
            />
          </div>
          <div className="mt-0">
            <span className="text-text-secondary text-xs">
              Battery <span className="text-blue-500">VDC</span>
            </span>
          </div>
        </div>

        {/* Charge Current */}
        <div className="bg-surface-dark rounded-lg p-2 flex flex-col justify-center items-center">
          <div className="w-full flex justify-center">
            <ReactSpeedometer
              width={window.innerWidth < 1465 ? 110 : 110}
              height={window.innerWidth < 1465 ? 85 : 85}
              maxValue={50}
              value={0}
              needleColor="#FF5252"
              startColor="#2E2E2E"
              endColor="#2E2E2E"
              segments={5}
              ringWidth={15}
              needleHeightRatio={0.7}
              textColor="#FFFFFF"
            />
          </div>
          <div className="mt-0">
            <span className="text-text-secondary text-xs">
              Charge <span className="text-blue-500">VDC</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EngineTab;
