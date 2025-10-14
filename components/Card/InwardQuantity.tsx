import React from "react";

const InwardQuantity = (props: any) => {
  return (
    <div className={`${props.className} border bg-white rounded-lg p-3`}>
      <h4 className="text-text">{props.title}</h4>
      <span className={`${props.valueClassName} text-xl font-medium`}>
        {props.value}
      </span>
    </div>
  );
};

export default InwardQuantity;
