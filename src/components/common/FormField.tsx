import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { FormControl, FormLabel, FormItem } from "../ui/form";
import { Input } from "../ui/input";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface FormFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder: string;
  type: "email" | "password" | "file" | "text" | "number";
  disabled?: boolean;
}

const FormField = <T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  type,
  disabled,
}: FormFieldProps<T>) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <FormItem className="gap-0.5">
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div className="relative">
              <Input
                className={`bg-primary-color placeholder:text-gray-300 ${
                  type === "password" && "pr-9"
                }`}
                placeholder={placeholder}
                type={
                  type === "password"
                    ? showPassword
                      ? "text"
                      : "password"
                    : type
                }
                disabled={disabled}
                {...field}
              />
              {type === "password" && (
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute p-1.5 bg-[#1E1E1E] right-1.5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 focus:outline-none"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              )}
            </div>
          </FormControl>
          {fieldState.error && (
            <p className="text-red-500 text-sm ">{fieldState.error.message}</p>
          )}
        </FormItem>
      )}
    />
  );
};

export default FormField;
