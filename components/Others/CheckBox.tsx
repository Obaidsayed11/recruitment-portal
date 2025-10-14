import React from "react";

const CheckBox = (props: any) => {
  return (
    <input
      type="checkbox"
      className="w-5 h-5 accent-primary"
      checked={props.checked}
      onChange={props.handleCheckboxChange}
      onClick={props.handleCheckboxClick}
    />
  );
};

export default CheckBox;
