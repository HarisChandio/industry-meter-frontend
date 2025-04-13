import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { FormControl, FormLabel, FormItem } from "../ui/form";
import { Input } from "../ui/input";

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
}: FormFieldProps<T>) => (
  <Controller
    name={name}
    control={control}
    render={({ field, fieldState }) => (
      <FormItem className="gap-0.5">
        <FormLabel>{label}</FormLabel>
        <FormControl>
          <Input
            className="bg-primary-color placeholder:text-gray-300"
            placeholder={placeholder}
            type={type}
            disabled={disabled}
            {...field}
          />
        </FormControl>
        {fieldState.error && (
          <p className="text-red-500 text-sm ">
            {fieldState.error.message}
          </p>
        )}
      </FormItem>
    )}
  />
);

export default FormField;
