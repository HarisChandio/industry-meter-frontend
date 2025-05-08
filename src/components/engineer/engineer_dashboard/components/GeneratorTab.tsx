import ReactSpeedometer from 'react-d3-speedometer';
import ManualModeHeader from './ManualModeHeader';
import { TabProps } from './TabProps';

function GeneratorTab({
  deviceData,
  onDeleteDevice,
  isLoading,
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

      {/* Voltage Output */}
      <div className="bg-surface-dark p-4 rounded-lg border border-text-secondary">
        <h2 className="text-lg font-semibold mb-4 text-accent-color">
          Voltage Output
        </h2>
        <div className="grid grid-cols-4 gap-4">
          <div className="flex flex-col items-center">
            <ReactSpeedometer
              maxValue={500}
              value={deviceData?.avg_ll_volt}
              needleColor="#FF5252"
              startColor="#2E2E2E"
              endColor="#2E2E2E"
              segments={5}
              ringWidth={15}
              needleHeightRatio={0.7}
              width={150}
              height={100}
              textColor="#FFFFFF"
            />
          </div>
          <div className="flex flex-col items-center">
            <ReactSpeedometer
              maxValue={500}
              value={deviceData?.avg_ln_volt}
              needleColor="#FF5252"
              startColor="#2E2E2E"
              endColor="#2E2E2E"
              segments={5}
              ringWidth={15}
              needleHeightRatio={0.7}
              width={150}
              height={100}
              textColor="#FFFFFF"
            />
          </div>
          <div className="flex flex-col items-center">
            <ReactSpeedometer
              maxValue={500}
              value={deviceData?.avg_current}
              needleColor="#FF5252"
              startColor="#2E2E2E"
              endColor="#2E2E2E"
              segments={5}
              ringWidth={15}
              needleHeightRatio={0.7}
              width={150}
              height={100}
              textColor="#FFFFFF"
            />
          </div>
          <div className="flex flex-col items-center">
            <ReactSpeedometer
              maxValue={500}
              value={deviceData?.frequency_hz}
              needleColor="#FF5252"
              startColor="#2E2E2E"
              endColor="#2E2E2E"
              segments={5}
              ringWidth={15}
              needleHeightRatio={0.7}
              width={150}
              height={100}
              textColor="#FFFFFF"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-2 justify-center mt-4 ml-12">
          <div className="flex flex-row items-center">
            <div className="w-full flex  flex-col justify-center">
              <span className="text-blue-500">Phase</span>

              <span className="text-text-primary mt-2">L1-L2 </span>
              <span className="text-text-primary mt-2">L2-L3 </span>
              <span className="text-text-primary mt-2">L3-L1 </span>
            </div>

            <div className="w-full flex  flex-col justify-center">
              <span className="text-blue-500 mt-2">Volts</span>

              <span className="text-text-primary mt-2">
                {' '}
                <span className="">{deviceData?.phase_a_voltage_ll}</span>{' '}
              </span>
              <span className="text-text-primary mt-2">
                <span className="">{deviceData?.phase_b_voltage_ll}</span>{' '}
              </span>
              <span className="text-text-primary mt-2">
                {' '}
                <span className="">{deviceData?.phase_c_voltage_ll}</span>{' '}
              </span>
            </div>
            <div className="w-full flex  flex-col justify-center">
              <span className="text-blue-500">L-N</span>

              <span className="text-text-primary mt-2">
                L1 <span className="">{deviceData?.phase_a_voltage_v}</span>{' '}
              </span>
              <span className="text-text-primary mt-2">
                L2 <span className="">{deviceData?.phase_b_voltage_v}</span>{' '}
              </span>
              <span className="text-text-primary mt-2">
                L3 <span className="">{deviceData?.phase_c_voltage_v}</span>{' '}
              </span>
            </div>

            <div className="w-full flex  flex-col justify-center">
              <span className="text-blue-500 mt-2">Amps</span>

              <span className="text-text-primary mt-2">
                {' '}
                <span className="">{deviceData?.phase_a_current_a}</span>{' '}
              </span>
              <span className="text-text-primary mt-2">
                {' '}
                <span className="">{deviceData?.phase_b_current_a}</span>{' '}
              </span>
              <span className="text-text-primary mt-2">
                {' '}
                <span className="">{deviceData?.phase_c_current_a}</span>{' '}
              </span>
            </div>

            <div className="w-full flex  flex-col justify-center">
              <span className="text-blue-500 mt-2">kW</span>

              <span className="text-text-primary mt-2">
                <span className="">{deviceData?.phase_a_real_power}</span>{' '}
              </span>
              <span className="text-text-primary mt-2">
                {' '}
                <span className="">{deviceData?.phase_b_real_power}</span>{' '}
              </span>
              <span className="text-text-primary mt-2">
                {' '}
                <span className="">{deviceData?.phase_c_real_power}</span>{' '}
              </span>
            </div>

            <div className="w-full flex  flex-col justify-center">
              <span className="text-blue-500 mt-2">kVA</span>

              <span className="text-text-primary mt-2">
                <span className="">{deviceData?.phase_a_apparent_power}</span>{' '}
              </span>
              <span className="text-text-primary mt-2">
                {' '}
                <span className="">
                  {deviceData?.phase_b_apparent_power}
                </span>{' '}
              </span>
              <span className="text-text-primary mt-2">
                {' '}
                <span className="">
                  {deviceData?.phase_c_apparent_power}
                </span>{' '}
              </span>
            </div>
            <div className="w-full flex  flex-col justify-center">
              <span className="text-blue-500 mt-2">kVAr</span>

              <span className="text-text-primary mt-2">
                <span className="">{deviceData?.phase_a_reactive_power}</span>{' '}
              </span>
              <span className="text-text-primary mt-2">
                {' '}
                <span className="">
                  {deviceData?.phase_b_reactive_power}
                </span>{' '}
              </span>
              <span className="text-text-primary mt-2">
                {' '}
                <span className="">
                  {deviceData?.phase_c_reactive_power}
                </span>{' '}
              </span>
            </div>
            <div className="w-full flex  flex-col justify-center">
              <span className="text-blue-500 mt-2">P</span>

              <span className="text-text-primary mt-2">
                <span className="">0 Lag</span>{' '}
              </span>
              <span className="text-text-primary mt-2">
                {' '}
                <span className="">0 Lag</span>{' '}
              </span>
              <span className="text-text-primary mt-2">
                {' '}
                <span className="">0 Lag</span>{' '}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GeneratorTab;
