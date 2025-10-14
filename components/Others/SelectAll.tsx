import React from "react";

interface SelectAllProps {
  handleSelectAll: (isChecked: boolean) => void;
  isAllSelected: boolean;
}

const SelectAll: React.FC<SelectAllProps> = ({
  handleSelectAll,
  isAllSelected,
}) => {
  return (
    <input
      type="checkbox"
      className="w-5 h-5 checkboxStyles accent-primary"
      checked={isAllSelected}
      onChange={(e) => handleSelectAll(e.target.checked)}
    />
  );
};

export default SelectAll;
