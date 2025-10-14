import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandGroup,
  CommandEmpty,
} from "../ui/command";
import { Button } from "../Sheets/Button";

export function AreaName({
  options,
  selectedValue,
  onSelect,
}: {
  options: { value: string; label: string }[];
  selectedValue: string;
  onSelect: (value: string) => void;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full shadow-none justify-between bg-transparent text-subtext font-normal h-full"
        >
          {selectedValue || "Select area"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 h-full">
        <Command>
          <CommandInput placeholder="Search area" />
          <CommandList>
            {options.length === 0 ? (
              <CommandEmpty>No area found.</CommandEmpty>
            ) : (
              <CommandGroup className="z-50 relative">
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={() => {
                      onSelect(option.value);
                      setOpen(false); // Close dropdown after selecting
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedValue === option.value
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
