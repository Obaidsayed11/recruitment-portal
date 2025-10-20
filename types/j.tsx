"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
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
import { Option } from "@/types/interface";
import Link from "next/link";

interface ComboboxDemoProps {
  options: Option[];
  value: any;
  onSelect: (value: string) => void;
  placeholder?: string;
  name?: string;
  className?: string;
  disabled?: boolean; // ? Added disabled prop
}

export function Combobox({
  options,
  value,
  onSelect,
  className,
  name,
  placeholder = "Select value",
  disabled = false, // ? Default to false
}: ComboboxDemoProps) {
  const [open, setOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");

  const filteredOptions = React.useMemo(() => {
    if (!searchTerm) return options;

    return options.filter((option) =>
      option?.label?.toLowerCase().includes(searchTerm?.toLowerCase())
    );
  }, [options, searchTerm]);

  return (
    <Popover open={open} onOpenChange={disabled ? undefined : setOpen}>
      <PopoverTrigger asChild className="shadow-none">
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-haspopup="listbox"
          disabled={disabled} // ? Apply disabled state to button
          className={`justify-between w-full overflow-hidden group bg-white relative border px-2 font-normal text-fontSecondary mt-0 ${className} h-11 ${
            disabled ? "opacity-50 cursor-not-allowed" : ""
          }`} // ? Add visual disabled styling
        >
          {!value
            ? placeholder
            : options.find((option) => option.value === value)?.label}
          <span className="w-7 bg-white absolute -right-1 h-full flex items-center">
            <ChevronsUpDown className="absolute w-6 right-2 bg-white my-auto ml-2 h-4 shrink-0 opacity-50" />
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className=" w-full p-0">
        <Command filter={() => 1}>
          <CommandInput
            placeholder={`Search ${placeholder.toLowerCase()}...`}
            value={searchTerm}
            onValueChange={setSearchTerm}
          />
          <CommandList
            onWheel={(e) => e.stopPropagation()}
            className="overflow-auto max-h-[300px]"
          >
            <CommandEmpty>No {name || "options"} found.</CommandEmpty>
            <CommandGroup>
              {filteredOptions.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={() => {
                    onSelect(option?.value );
                    setOpen(false);
                    setSearchTerm("");
                  }}
                  className={value === option.value ? "bg-secondary" : ""}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

