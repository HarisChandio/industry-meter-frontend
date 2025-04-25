import { Form } from "@/components/ui/form";
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import FormField from "@/components/common/FormField";

const addDeviceSchema = z.object({
  device_id: z.coerce
    .number()
    .min(1, "Device ID is must be a number and greater than 1"),
  location: z.string().min(1, "Location is required"),
});

export default function AddDialogBox({
  isAddDeviceOpen,
  setIsAddDeviceOpen,
  form,
  onSubmit,
  isLoading,
}: {
  isAddDeviceOpen: boolean;
  setIsAddDeviceOpen: (isOpen: boolean) => void;
  form: UseFormReturn<z.infer<typeof addDeviceSchema>>;
  onSubmit: (values: z.infer<typeof addDeviceSchema>) => void;
  isLoading?: boolean;
}) {
  return (
    <>
      <Dialog open={isAddDeviceOpen} onOpenChange={setIsAddDeviceOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              Add New Device
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Enter the device details to add a new smart meter.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="device_id"
                label="Device ID"
                placeholder="Enter device ID"
                type="number"
                disabled={isLoading}
              />
              <FormField
                control={form.control}
                name="location"
                label="Location"
                placeholder="Enter device location"
                type="text"
                disabled={isLoading}
              />
              <DialogFooter className="pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddDeviceOpen(false)}
                  className="bg-transparent border-gray-600 text-white hover:text-white hover:bg-gray-700"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-(--color-bg-accent) hover:bg-(--color-bg-accent-hover) text-white"
                >
                  Add
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
