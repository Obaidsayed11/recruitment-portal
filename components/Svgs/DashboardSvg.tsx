import React from "react";

const DashboardSvg = ({ isActive = false }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="20"
      viewBox="0 0 22 22"
      fill="none"
      className="transition-all duration-300"
    >
      <path
        d="M9.61393 19.3533C9.61393 20.2627 8.84259 21 7.89114 21H2.72279C1.77133 21 1 20.2627 1 19.3533V16.0599C1 15.1505 1.77133 14.4132 2.72279 14.4132H7.89114C8.84259 14.4132 9.61393 15.1505 9.61393 16.0599V19.3533Z"
        stroke={isActive ? "white" : "#434343"}
        className="group-hover:stroke-white group-active:stroke-white"
        strokeWidth="2"
        strokeMiterlimit="10"
      />
      <path
        d="M9.61393 9.23352C9.61393 10.143 8.84259 10.8802 7.89114 10.8802H2.72279C1.77133 10.8802 1 10.143 1 9.23352V2.6467C1 1.73727 1.77133 1 2.72279 1H7.89114C8.84259 1 9.61393 1.73727 9.61393 2.6467V9.23352Z"
        stroke={isActive ? "white" : "#434343"}
        className="group-hover:stroke-white group-active:stroke-white"
        strokeWidth="2"
        strokeMiterlimit="10"
      />
      <path
        d="M21 19.3533C21 20.2627 20.2287 21 19.2772 21H14.1089C13.1574 21 12.3861 20.2627 12.3861 19.3533V12.7665C12.3861 11.8571 13.1574 11.1198 14.1089 11.1198H19.2772C20.2287 11.1198 21 11.8571 21 12.7665V19.3533Z"
        stroke={isActive ? "white" : "#434343"}
        className="group-hover:stroke-white group-active:stroke-white"
        strokeWidth="2"
        strokeMiterlimit="10"
      />
      <path
        d="M21 5.94011C21 6.84954 20.2287 7.58681 19.2772 7.58681H14.1089C13.1574 7.58681 12.3861 6.84954 12.3861 5.94011V2.6467C12.3861 1.73727 13.1574 1 14.1089 1H19.2772C20.2287 1 21 1.73727 21 2.6467V5.94011Z"
        stroke={isActive ? "white" : "#434343"}
        className="group-hover:stroke-white group-active:stroke-white"
        strokeWidth="2"
        strokeMiterlimit="10"
      />
    </svg>
  );
};

export default DashboardSvg;
