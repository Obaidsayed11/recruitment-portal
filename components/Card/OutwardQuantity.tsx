import React from "react";

const OutwardQuantity = (props: any) => {
  return (
    <div className="bg-white rounded-lg p-3">
      <h4>{props.title}</h4>
      <div className="text-green-500 flex gap-4">
        <span>{props.quantity} Pcs</span>
        <span>{props.weight}</span>
      </div>
    </div>
  );
};

export default OutwardQuantity;
