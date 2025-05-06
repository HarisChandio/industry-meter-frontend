import { HoverName } from "./HoverName";

interface IconType {
  iconType:
    | "emissionFilter"
    | "autoRegeneration"
    | "defLevelLow"
    | "scrInducement"
    | "engineAirInlet"
    | "chargeAlternator"
    | "oilPressure"
    | "fuelLevel"
    | "batteryVoltage"
    | "coolantTemp"
    | "ecuLamp"
    | "waterInFuel";
}

export const StatusIcon = ({ iconType }: IconType) => {
  const getIconContent = () => {
    switch (iconType) {
      case "emissionFilter":
        return (
          // <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          //   <path d="M12 3c-4.4 0-8 3.6-8 8 0 3.8 2.6 6.9 6.2 7.8.2-2 1.4-3.8 3.2-4.8 1-1.6 1.4-3.4 1.2-5.2-.1-1-.5-2-1.4-2.6 2.2.8 3.8 2.6 4.5 4.8.1.3.2.6.2.9v.8c2.1-1.5 3.5-4 3.5-6.7.1-4.4-3.5-8-7.4-8zm1 14.5c-1-.7-2.3-.5-3 .5-.7 1-.5 2.3.5 3 1 .7 2.3.5 3-.5.6-1 .5-2.3-.5-3z" />
          //   <path d="M16 21v-2h-1v-1.4c-.9.9-2.1 1.4-3.3 1.4-1.3 0-2.5-.6-3.4-1.6l-.7.6H7V21h9z" />
          // </svg>
          <img
            src="/Screenshot 2025-05-06 235951.png"
            alt="Emission Filter"
            className="size-7 object-contain"
          />
        );
      case "autoRegeneration":
        return (
          // <img src="/rabbit.png" alt="Auto Regeneration" className="w-5 h-5 object-contain" />
          <img
            src="/Screenshot 2025-05-06 235708.png"
            alt="Auto Regeneration"
            className="size-7 object-contain"
          />
        );
      case "defLevelLow":
        return (
          // <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          //   <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8z" />
          //   <path d="M12 6c-.6 0-1 .4-1 1v6c0 .6.4 1 1 1s1-.4 1-1V7c0-.6-.4-1-1-1z" />
          //   <path d="M12 16c-.8 0-1.5.7-1.5 1.5S10.2 19 11 19s1.5-.7 1.5-1.5S11.8 16 11 16z" />
          // </svg>
          <img
            src="/Screenshot 2025-05-06 235725.png"
            alt="Auto Regeneration"
            className="size-7 object-contain"
          />
        );
      case "scrInducement":
        return (
          // <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          //   <path d="M13 9h5.5L13 3.5V9M7.5 4H2v16h20V10h-9.5L7.5 4zM3.75 18.25h16.5v-7.5H3.75v7.5z" />
          //   <path d="M10.05 15.55l1.95-1V17h.9l1.95-3.95h-1.2l-1.05 2.1v-2.1h-1l-1.95 1v-1H8.5v3.95h1.05l.5-1.45z" />
          // </svg>
          <img
            src="/Screenshot 2025-05-06 235739.png"
            alt="Auto Regeneration"
            className="size-7 object-contain"
          />
        );
      case "engineAirInlet":
        return (
          // <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          //   <path d="M12 2.5L8 7h8l-4-4.5zM6 9l-4 4.5 4 4.5V9zm12 0v9l4-4.5-4-4.5zM8 17l4 4.5 4-4.5H8z" />
          //   <circle cx="12" cy="12" r="2.5" />
          // </svg>
          <img
            src="/Screenshot 2025-05-06 235808.png"
            alt="Auto Regeneration"
            className="size-7 object-contain"
          />
        );
      case "chargeAlternator":
        return (
          // <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          //   <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
          //   <path d="M15 14h-4.5l2-6H9l-3 9h4.5l-2 6H12l3-9z" />
          // </svg>
          <img
            src="/Screenshot 2025-05-06 235837.png"
            alt="Auto Regeneration"
            className="size-7 object-contain"
          />
        );
      case "oilPressure":
        return (
          // <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          //   <path d="M12 2.5c-5.25 0-9.5 4.25-9.5 9.5s4.25 9.5 9.5 9.5 9.5-4.25 9.5-9.5-4.25-9.5-9.5-9.5zm0 17c-4.14 0-7.5-3.36-7.5-7.5S7.86 4.5 12 4.5s7.5 3.36 7.5 7.5-3.36 7.5-7.5 7.5z" />
          //   <path d="M11 7h2v8h-2z" />
          //   <path d="M11 15h2v2h-2z" />
          // </svg>
          <img
            src="/Screenshot 2025-05-06 235847.png"
            alt="Auto Regeneration"
            className="size-7 object-contain"
          />
        );
      case "fuelLevel":
        return (
          // <img src="/fuel1.png" alt="Fuel Level" className="w-5 h-5 object-contain" />
          <img
            src="/Screenshot 2025-05-06 235859.png"
            alt="Auto Regeneration"
            className="size-7 object-contain"
          />
        );
      case "batteryVoltage":
        return (
          // <img src="/battery.png" alt="Battery Voltage" className="w-5 h-5 object-contain" />
          <img
            src="/Screenshot 2025-05-06 235911.png"
            alt="Auto Regeneration"
            className="size-7 object-contain"
          />
        );
      case "coolantTemp":
        return (
          // <img src="/2.png" alt="Coolant Temperature" className="w-5 h-5 object-contain" />
          <img
            src="/Screenshot 2025-05-06 235921.png"
            alt="Auto Regeneration"
            className="size-7 object-contain"
          />
        );
      case "ecuLamp":
        return (
          // <img
          // src="/key.png"
          // alt="ECU Lamp"
          // className="w-5 h-5 object-contain"
          // />
          <img
            src="/Screenshot 2025-05-06 235931.png"
            alt="Auto Regeneration"
            className="size-7 object-contain"
          />
        );
      case "waterInFuel":
        return (
          //     <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          //   <path d="M12 2c-5.33 4.55-8 8.48-8 11.8 0 4.98 3.8 8.2 8 8.2s8-3.22 8-8.2c0-3.32-2.67-7.25-8-11.8zm0 18c-3.35 0-6-2.57-6-6.2 0-2.34 1.95-5.44 6-9.14 4.05 3.7 6 6.79 6 9.14 0 3.63-2.65 6.2-6 6.2z" />
          //   <path d="M7.83 14c.37-.4.91-.66 1.52-.66 1.09 0 2 .89 2 2 0 .37-.11.71-.28 1h2.17c.28-.3.46-.64.54-1.04.15-.75-.08-1.47-.5-2-1.1-1.39-3.25-1.21-4.11.35-.41.73-.34 1.62.12 2.69h2.14c-.2-.15-.32-.38-.32-.65 0-.44.36-.8.8-.8.44 0 .8.36.8.8 0 .25-.04.48-.18.65h2.13c.46-1.06.5-1.91.13-2.65-.86-1.58-3.07-1.78-4.1-.35-.11.15-.21.32-.28.5h-2.68z" />
          // </svg>
          <img
            src="/Screenshot 2025-05-06 235940.png"
            alt="Auto Regeneration"
            className="size-7 object-contain"
          />
        );
      default:
        return "?";
    }
  };

  const getTitleText = () => {
    const names: Record<IconType["iconType"], string> = {
      emissionFilter: "Emission Filter",
      autoRegeneration: "Auto Regeneration Inhibit",
      defLevelLow: "DEF Level Low",
      scrInducement: "SCR Inducement",
      engineAirInlet: "Engine Air Inlet Temperature",
      chargeAlternator: "Charge Alternator",
      oilPressure: "Oil Pressure",
      fuelLevel: "Fuel Level",
      batteryVoltage: "Battery Voltage",
      coolantTemp: "Coolant Temperature",
      ecuLamp: "ECU Lamp",
      waterInFuel: "Water in Fuel",
    };

    return names[iconType];
  };

  return (
    <HoverName title={getTitleText()}>
      <div className="w-10 h-10 flex items-center justify-center text-gray-300">
        {getIconContent()}
      </div>
    </HoverName>
  );
};

export const StatusIconGrid = () => {
  const parameters: IconType["iconType"][] = [
    "emissionFilter",
    "autoRegeneration",
    "defLevelLow",
    "scrInducement",
    "engineAirInlet",
    "chargeAlternator",
    "oilPressure",
    "fuelLevel",
    "batteryVoltage",
    "coolantTemp",
    "ecuLamp",
    "waterInFuel",
  ];

  return (
    <div className=" flex justify-center items-center">
      <div className="flex flex-wrap justify-center items-center gap-4">
        {parameters.map((param) => (
          <div
            key={param}
            className="flex flex-col items-center cursor-pointer"
          >
            <StatusIcon iconType={param} />
          </div>
        ))}
      </div>
    </div>
  );
};
