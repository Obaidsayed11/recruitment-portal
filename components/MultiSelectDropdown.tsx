// components/Form_Fields/MultiSelectDropdown.tsx
import * as React from "react";
import { Check, ChevronDown } from "lucide-react";

// Assuming you have these UI components from your project/Shadcn UI
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import { Button } from "./ui/button";
import CheckBox from "./Others/CheckBox";


type Option = {
  value: string;
  label: string;
};

interface MultiSelectDropdownProps {
  options: Option[];
  value: string[]; // Array of selected values (permission IDs)
  onChange: (value: string[]) => void; // Function to update the form state
  placeholder: string;
  label: string;
}

export const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  options,
  value,
  onChange,
  placeholder,
  label,
}) => {
  const [open, setOpen] = React.useState(false);

  // Function to handle toggling a selection
  const handleSelect = (currentValue: string) => {
    const isSelected = value.includes(currentValue);

    const newValues = isSelected
      ? value.filter((id) => id !== currentValue) // Remove
      : [...value, currentValue]; // Add

    onChange(newValues);
  };

  const selectedCount = value.length;
  const buttonText = selectedCount === 0 
    ? placeholder 
    : selectedCount === 1 
    ? options.find(opt => opt.value === value[0])?.label 
    : `${selectedCount} ${label} selected`;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button" // Important: Prevent form submission
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between overflow-hidden text-left"
        >
          <span className="truncate">{buttonText}</span>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandGroup>
            {options.map((option) => {
              const isSelected = value.includes(option.value);
              return (
                <CommandItem
                  key={option.value}
                  onSelect={() => handleSelect(option.value)}
                  className="flex justify-between cursor-pointer"
                >
                  {/* Checkbox for visual confirmation */}
                  <div className="flex items-center space-x-2">
                    <CheckBox
                      checked={isSelected}
                      // Checkbox state is managed by the CommandItem onSelect
                      onCheckedChange={() => handleSelect(option.value)} 
                    />
                    <span className="line-clamp-1">{option.label}</span>
                  </div>
                  {/* Hidden checkmark for compatibility/accessibility */}
                  <Check
                    className={`h-4 w-4 ${isSelected ? 'opacity-100' : 'opacity-0'}`}
                  />
                </CommandItem>
              );
            })}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};