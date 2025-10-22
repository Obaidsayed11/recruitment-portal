import React, { useState, useEffect, useMemo, useRef } from "react";
import type { FC } from "react";
import { ChevronDown } from "lucide-react";
import { Permission } from "@/types/UserTabs"; // Assumes this type includes 'id' and 'codename'

// --- Type Definitions ---
interface GroupedPermission {
  groupName: string;
  permissions: Permission[];
}

// **FIXED**: Props now include the full list of permissions
interface PermissionsManagerProps {
  allPermissions: Permission[];
  selectedPermissions: Set<string>;
  onSelectionChange: (newSelection: Set<string>) => void;
}

// --- Helper Functions ---
// Grouping logic correctly remains based on 'codename'
const formatGroupName = (key: string): string => {
  return key
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const groupPermissions = (permissions: Permission[]): GroupedPermission[] => {
  const grouped = permissions.reduce(
    (acc: Record<string, GroupedPermission>, permission) => {
      const { codename } = permission;
      const firstUnderscoreIndex = codename.indexOf("_");
      if (firstUnderscoreIndex === -1) return acc;
      const groupKey = codename.substring(firstUnderscoreIndex + 1);
      if (!acc[groupKey]) {
        acc[groupKey] = {
          groupName: formatGroupName(groupKey),
          permissions: [],
        };
      }
      acc[groupKey].permissions.push(permission);
      return acc;
    },
    {}
  );
  return Object.values(grouped);
};

// --- Component ---
const PermissionsManager: FC<PermissionsManagerProps> = ({
  allPermissions, // **FIXED**: Now receives all permissions as a prop
  selectedPermissions,
  onSelectionChange,
}) => {
  const [openGroupName, setOpenGroupName] = useState<string | null>(null);

  const groupedPermissions: GroupedPermission[] = useMemo(() => {
    if (allPermissions && allPermissions.length > 0) {
      return groupPermissions(allPermissions);
    }
    return [];
  }, [allPermissions]);

  // --- Handlers consistently use `id` ---
  const handleMasterSelectAll = (isChecked: boolean) => {
    if (isChecked) {
      onSelectionChange(new Set(allPermissions.map((p) => p.id)));
    } else {
      onSelectionChange(new Set());
    }
  };

  const handleGroupSelectAll = (
    group: GroupedPermission,
    isChecked: boolean
  ) => {
    const groupPermissionIds = new Set(group.permissions.map((p) => p.id));
    const newSelected = new Set(selectedPermissions);

    if (isChecked) {
      groupPermissionIds.forEach((id) => newSelected.add(id));
    } else {
      groupPermissionIds.forEach((id) => newSelected.delete(id));
    }
    onSelectionChange(newSelected);
  };

  const handlePermissionChange = (permissionId: string, isChecked: boolean) => {
    const newSelected = new Set(selectedPermissions);
    if (isChecked) {
      newSelected.add(permissionId);
    } else {
      newSelected.delete(permissionId);
    }
    onSelectionChange(newSelected);
  };

  const isAllSelected =
    allPermissions.length > 0 &&
    selectedPermissions.size === allPermissions.length;

  const masterCheckboxRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (masterCheckboxRef.current) {
      masterCheckboxRef.current.indeterminate =
        selectedPermissions.size > 0 && !isAllSelected;
    }
  }, [selectedPermissions, isAllSelected]);

  // Loading and error states are now handled by the parent
  if (!allPermissions) return <div>Loading permissions...</div>;

  return (
    <div className="grid gap-2 w-full border bg-white border-[#e8e8e8] p-5 rounded-md  overflow-auto">
      <div className="flex mb-4 items-center space-x-3">
        <input
          ref={masterCheckboxRef}
          type="checkbox"
          id="master-select-all"
          className="h-5 w-5 accent-primary rounded border-gray-300"
          checked={isAllSelected}
          onChange={(e) => handleMasterSelectAll(e.target.checked)}
        />
        <label
          htmlFor="master-select-all"
          className="text-text font-medium select-none"
        >
          Select All Permissions
        </label>
      </div>
      {groupedPermissions.map((group) => {
        const selectedInGroupCount = group.permissions.filter((p) =>
          selectedPermissions.has(p.id)
        ).length;
        const isGroupFullySelected =
          group.permissions.length > 0 &&
          selectedInGroupCount === group.permissions.length;
        const isGroupPartiallySelected =
          selectedInGroupCount > 0 && !isGroupFullySelected;
        const isOpen = openGroupName === group.groupName;

        return (
          <div
            key={group.groupName}
            className="border rounded-lg bg-white overflow-hidden h-fit-content"
          >
            <button
              type="button"
              onClick={() => setOpenGroupName(isOpen ? null : group.groupName)}
              className="w-full flex items-center justify-between p-2 bg-white hover:bg-accent"
            >
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  onClick={(e) => e.stopPropagation()}
                  className="h-4 accent-primary w-4 rounded border-gray-300"
                  checked={isGroupFullySelected}
                  onChange={(e) =>
                    handleGroupSelectAll(group, e.target.checked)
                  }
                  ref={(el) => {
                    if (el) el.indeterminate = isGroupPartiallySelected;
                  }}
                />
                <h2 className="text-text font-medium">{group.groupName}</h2>
              </div>
              <ChevronDown
                className={`w-5 h-5 transition-transform ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {isOpen && (
              <div className="p-4 border-t">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {group.permissions.map((permission) => (
                    <div
                      key={permission.id}
                      className="flex items-center space-x-2"
                    >
                      <input
                        type="checkbox"
                        id={permission.id}
                        className="h-4 w-4 rounded accent-primary"
                        checked={selectedPermissions.has(permission.id)}
                        onChange={(e) =>
                          handlePermissionChange(
                            permission.id,
                            e.target.checked
                          )
                        }
                      />
                      <label htmlFor={permission.id} className="text-sm">
                        {permission.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default PermissionsManager;
