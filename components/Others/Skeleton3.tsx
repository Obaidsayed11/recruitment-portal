import React from "react";

const SidebarSkeleton = (props: any) => {
  return (
    <>
      <div className="grid gap-6">
        {" "}
        {/* Use gap for spacing between list items */}
        {[...Array(6)].map(
          (
            _,
            i // Assuming 6 list items based on your UI
          ) => (
            <div key={i} className="flex items-center gap-2 px-2">
              {/* Icon placeholder */}
              <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse mr-3"></div>
              {/* Text placeholder */}
              <div className="flex-grow h-6 rounded-md bg-gray-200 animate-pulse"></div>
            </div>
          )
        )}
      </div>
    </>
  );
};

export default SidebarSkeleton;
