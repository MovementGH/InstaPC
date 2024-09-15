"use client";
import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { OS, OS_UI_NAMES } from "@/entities";

export function OsCombobox({ onSelect }: { onSelect: (value: OS) => void }) {
  const [open, setOpen] = React.useState(false);
  const [selectedOs, setOs] = React.useState<OS>(OS.Win11);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] bg-input border-none justify-between"
        >
          {OS_UI_NAMES[selectedOs]}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search for OS" />
          <CommandList>
            <CommandEmpty>No OS found.</CommandEmpty>
            <CommandGroup>
              {Object.values(OS).map((os) => (
                <CommandItem
                  key={os}
                  value={os}
                  onSelect={() => {
                    setOs(os);
                    setOpen(false);
                    onSelect(os);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedOs === os ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {OS_UI_NAMES[os]}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
