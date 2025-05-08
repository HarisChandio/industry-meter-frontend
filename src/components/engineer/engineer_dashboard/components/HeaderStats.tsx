import { DeviceData } from '@/store/slices/admin/adminTypes';

// Reusable Header Stats component to show the meter UI
function HeaderStats({ deviceData }: { deviceData?: DeviceData }) {
  return (
    <div className="bg-gray-800 p-2 md:p-4 rounded-md shadow-md overflow-x-auto border border-gray-700">
      <div className="flex flex-col lg:flex-row items-start justify-between min-w-full gap-10 ">
        <div className=" flex flex-1 border-r border-gray-700 ">
          {/* Left Side - First Total */}
          <div className="flex flex-col justify-start items-center min-w-[120px] ">
            <div className="text-[#00BFFF] mb-1 text-sm md:text-base">
              Total
            </div>
            <div className="text-[#FFFF00] text-lg md:text-xl font-bold">
              {deviceData?.phase_a_frequency_hz || 0}{' '}
              <span className="text-[#00BFFF]">HZ</span>
            </div>
            <div className="flex justify-between gap-2">
              <span className="text-accent-color">
                <span className="text-blue-500">W</span>
              </span>
              <span className="text-accent-color">
                {deviceData?.power_percentage || 0}{' '}
                <span className="text-blue-500">%</span>
              </span>
            </div>
            <div className="flex justify-between gap-2">
              <span className="text-accent-color">
                <span className="text-blue-500">kW</span>
              </span>
              <span className="text-accent-color">
                {deviceData?.power_percentage
                  ? (deviceData.power_percentage / 1000) * 100
                  : 0}{' '}
                <span className="text-blue-500">%</span>
              </span>
            </div>
            <div className="text-[#00BFFF] text-lg md:text-xl">pf</div>
          </div>

          {/* Center Section */}
          <div className="flex flex-col flex-grow mx-0 lg:mx-4 w-full lg:w-auto mb-4 lg:mb-0">
            {/* Title */}
            <div className="text-center mb-2">
              <span className="text-[#00BFFF] text-xl md:text-2xl lg:text-3xl font-bold">
                Manual Mode
              </span>
            </div>

            {/* Two Icons with Hz lines */}
            <div className="flex justify-between">
              {/* Left side - Tower Icon with Hz */}
              <div className="flex flex-col items-center">
                <img
                  src="/tower-icon.svg"
                  alt="Tower"
                  className="w-6 h-6 md:w-8 md:h-8 mb-1"
                />
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-[#00FF00]"></div>
                  <span className="text-white text-xs md:text-sm">
                    {deviceData?.phase_a_frequency_hz || 0}
                  </span>
                  <span className="text-[#00BFFF] text-xs md:text-sm">Hz</span>
                </div>
              </div>

              {/* Red Line */}
              <div className="flex-grow mx-2 md:mx-4 flex items-center">
                <div className="h-1 w-full bg-red-600"></div>
              </div>

              {/* Right side - Generator Icon with Hz */}
              <div className="flex flex-col items-center">
                <img
                  src="/generator-icon.svg"
                  alt="Generator"
                  className="w-6 h-6 md:w-8 md:h-8 mb-1"
                />
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-[#00FF00]"></div>
                  <span className="text-white text-xs md:text-sm">
                    {deviceData?.phase_a_frequency_hz || 0}
                  </span>
                  <span className="text-[#00BFFF] text-xs md:text-sm">Hz</span>
                </div>
              </div>
            </div>

            {/* Percentage Bars */}
            <div className="flex mt-2 md:mt-4 justify-between">
              {/* Left Percentage */}
              <div className="flex-1 pr-2 md:pr-4">
                <div className="flex justify-between mb-1">
                  <span className="text-[#00BFFF] text-xs md:text-sm">kW</span>
                  <span className="text-[#FFFF00] text-xs md:text-sm">
                    {/* {deviceData?.power_percentage || 0} % */}
                    0%
                  </span>
                </div>
                <div className="h-3 md:h-4 w-full bg-gray-700">
                  <div
                    className="h-full bg-[#00BFFF]"
                    // style={{ width: `${deviceData?.power_percentage || 0}%` }}
                    style={{ width: `0` }}
                  ></div>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-[#00BFFF] text-xs md:text-sm">
                    kVAr
                  </span>
                  <span className="text-[#FFFF00] text-xs md:text-sm">
                    {/* {deviceData?.phase_a_reactive_power || 0} % */}
                    0%
                  </span>
                </div>
                <div className="h-3 md:h-4 w-full bg-gray-700">
                  <div
                    className="h-full bg-[#00BFFF]"
                    // style={{
                    //   width: `${deviceData?.phase_a_reactive_power || 0}%`,
                    // }}
                    style={{
                      width: `0`,
                    }}
                  ></div>
                </div>
              </div>

              {/* Right Percentage */}
              <div className="flex-1 pl-2 md:pl-4">
                <div className="flex justify-between mb-1">
                  <span className="text-[#00BFFF] text-xs md:text-sm">kW</span>
                  <span className="text-[#FFFF00] text-xs md:text-sm">
                    {/* {deviceData?.phase_b_real_power || 0} % */}
                    0%
                  </span>
                </div>
                <div className="h-3 md:h-4 w-full bg-gray-700">
                  <div
                    className="h-full bg-[#00BFFF]"
                    // style={{ width: `${deviceData?.phase_b_real_power || 0}%` }}
                    style={{ width: `0` }}
                  ></div>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-[#00BFFF] text-xs md:text-sm">
                    kVAr
                  </span>
                  <span className="text-[#FFFF00] text-xs md:text-sm">
                    {/* {deviceData?.phase_b_reactive_power || 0} % */}
                    0%
                  </span>
                </div>
                <div className="h-3 md:h-4 w-full bg-gray-700">
                  <div
                    className="h-full bg-[#00BFFF]"
                    // style={{
                    //   width: `${deviceData?.phase_b_reactive_power || 0}%`,
                    // }}
                    style={{
                      width: `0`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Total */}
          <div className=" flex flex-col justify-start items-center min-w-[120px] mb-2 lg:mb-4">
            <div className="text-[#00BFFF] mb-1 text-sm md:text-base">
              Total
            </div>
            <div className="text-[#FFFF00] text-lg md:text-xl font-bold">
              {/* {deviceData?.instantaneous_power_kw || 0}{' '} */}
              0
              <span className="text-[#00BFFF]">kW</span>
            </div>
            <div className="text-[#FFFF00] text-lg md:text-xl font-bold">
              {/* {deviceData?.phase_b_apparent_power || 0}{' '} */}
              0
              <span className="text-[#00BFFF]">kVA</span>
            </div>
            <div className="text-[#FFFF00] text-lg md:text-xl font-bold">
              {/* {deviceData?.phase_c_reactive_power || 0}{' '} */}
              0
              <span className="text-[#00BFFF]">kVAr</span>
            </div>
            <div className="flex items-center">
              <span className="text-[#FFFF00] text-lg md:text-xl font-bold">
                {/* {deviceData?.power_percentage
                  ? (deviceData.power_percentage / 100).toFixed(2)
                  : '0.00'} */}
                  0 
              </span>
              <span className="text-[#00BFFF] ml-1 text-lg md:text-xl">pf</span>
            </div>
            <div className="text-[#FFFF00] text-lg md:text-xl font-bold">
              Lag
            </div>
          </div>
        </div>

        {/* Right Side - Total and Energy Generator */}
        <div className="flex gap-4 md:gap-8 lg:gap-4 w-full lg:w-auto">
          {/* Energy Generator */}
          <div className="min-w-[120px] flex flex-col items-end ">
            <div className="text-[#00BFFF] mb-1 text-sm md:text-base">
              Energy Generator
            </div>
            <div className="text-[#FFFF00] text-lg md:text-xl font-bold">
              {/* {deviceData?.instantaneous_power_kw || 0}{' '} */}
              0
              <span className="text-[#00BFFF]">kWh</span>
              <span className="text-[#00BFFF] ml-1">+</span>
            </div>
            <div className="text-[#FFFF00] text-lg md:text-xl font-bold">
              {/* {deviceData?.phase_c_apparent_power || 0}{' '} */}
              0
              <span className="text-[#00BFFF]">kVAh</span>
            </div>
            <div className="text-[#FFFF00] text-lg md:text-xl font-bold">
              {/* {deviceData?.phase_c_reactive_power || 0}{' '} */}
              0
              <span className="text-[#00BFFF]">kVArh</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeaderStats;
