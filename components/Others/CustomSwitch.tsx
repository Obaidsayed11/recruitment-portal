import { useState, useEffect } from "react";

export function CustomSwitch({
  id,
  isActive,
  onToggle,
}: {
  id: string;
  isActive: boolean; // Accept initial active state
  onToggle: (checked: boolean) => Promise<boolean>; // ✅ Expect an async function
}) {
  const [isChecked, setIsChecked] = useState(isActive);

  useEffect(() => {
    setIsChecked(isActive);
  }, [isActive]);

  const handleToggle = async () => {
    const newChecked = !isChecked;
    
    try {
      const success = await onToggle(newChecked); // ✅ Await the promise
      if (success) {
        setIsChecked(newChecked);
      }
    } catch (error) {
      console.error("Toggle failed:", error);
    }
  };

  return (
    <div
      onClick={handleToggle}
      className={`relative w-12 h-6 flex items-center bg-gray-300 rounded-full p-1 cursor-pointer transition-colors 
        ${isChecked ? "bg-green-500" : "bg-gray-300"}`}
    >
      <div
        className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform 
          ${isChecked ? "translate-x-6" : "translate-x-0"}`}
      ></div>
    </div>
  );
}

 