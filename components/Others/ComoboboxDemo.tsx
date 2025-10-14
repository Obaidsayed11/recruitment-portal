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
  value: number | string; // Allow null for unselected state
  onSelect: (value: number) => void; // Only allow number
  placeholder?: string; // Optional placeholder prop
  name?: string; // Optional placeholder prop
  className?: string;
}

export function Combobox({
  options,
  value,
  onSelect,
  className,
  name,
  placeholder = "Select value",
}: ComboboxDemoProps) {
  const [open, setOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  console.log("value", value);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-haspopup="listbox"
          className={`w-full justify-between bg-white border px-2 font-normal text-fontSecondary mt-0 ${className} h-11`}
        >
          {value
            ? options.find((option) => option.value === value)?.label
            : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="h-full w-full p-0">
        <Command>
          <CommandInput
            placeholder={`${placeholder}`}
            onValueChange={(value) => setSearchTerm(value)}
          />
          <CommandList>
            {filteredOptions.length > 0 ? (
              <CommandGroup>
                {filteredOptions.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.label} // Convert number to string
                    onSelect={() => {
                      onSelect(option.value); // Use option.value directly here
                      setOpen(false); // Close dropdown
                      setSearchTerm(""); // Reset search term on selection
                    }}
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
            ) : (
              name && (
                <>
                  <CommandEmpty>No {name} found.</CommandEmpty>
                  {options.length < 0 && (
                    <Link
                      href={`/admin/${name}`}
                      className="underline text-primary items-center gap-1 justify-center text-sm pb-5 flex"
                    >
                      <Plus size={16} />
                      Add {name} first
                    </Link>
                  )}
                </>
              )
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
