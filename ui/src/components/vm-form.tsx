"use client";
import { OS, OS_UI_NAMES, VMData } from "@/entities";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "./ui/slider";
import { capitalize } from "@/lib/utils";
import { DialogClose } from "./ui/dialog";

const MIN_MEM = 2048;
const MAX_MEM = 16384;
const MIN_CORES = 1;
const MAX_CORES = 4;
const MIN_DISK = 16;
const MAX_DISK = 64;

export const vmFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  os: z.nativeEnum(OS),
  memory: z.number().min(MIN_MEM).max(MAX_MEM),
  cores: z.number().min(MIN_CORES).max(MAX_CORES),
  disk: z.number().min(MIN_DISK).max(MAX_DISK),
});

function FormSliderField({
  form,
  name,
  label,
  min,
  max,
  step,
  unit,
}: {
  form: UseFormReturn<z.infer<typeof vmFormSchema>>;
  name: "memory" | "cores" | "disk";
  label: string;
  min: number;
  max: number;
  step: number;
  unit?: string;
}) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel htmlFor={name}>
            {capitalize(name)} {unit ? `(${unit})` : ""}
          </FormLabel>
          <FormControl>
            <Slider
              id={name}
              min={min}
              max={max}
              step={step}
              defaultValue={[field.value]}
              onValueChange={(value) => form.setValue(name, value[0])}
            />
          </FormControl>
          <FormDescription>
            {field.value} {unit ? unit : ""}
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export default function VMForm({ defaultValues, onSubmit }: { defaultValues?: VMData, onSubmit: (values: z.infer<typeof vmFormSchema>) => void}) {
  const form = useForm<z.infer<typeof vmFormSchema>>({
    resolver: zodResolver(vmFormSchema),
    defaultValues: defaultValues,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="name">Name</FormLabel>
              <FormControl>
                <Input placeholder="My PC" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="os"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="os">Operating System</FormLabel>
              <FormControl>
                <Select
                  defaultValue={field.value}
                  onValueChange={(value: OS) => form.setValue("os", value)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(OS).map((value: OS, index: number) => (
                      <SelectItem value={value} key={index}>
                        {OS_UI_NAMES[value]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormSliderField
          form={form}
          name="memory"
          label="Memory"
          min={MIN_MEM}
          max={MAX_MEM}
          step={256}
          unit="MB"
        />
        <FormSliderField
          form={form}
          name="cores"
          label="CPU Cores"
          min={MIN_CORES}
          max={MAX_CORES}
          step={1}
        />
        <FormSliderField
          form={form}
          name="disk"
          label="Disk Space"
          min={MIN_DISK}
          max={MAX_DISK}
          step={2}
          unit="GB"
        />
        <DialogClose>
            <Button type="submit">Submit</Button>
        </DialogClose>
      </form>
    </Form>
  );
}
