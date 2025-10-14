import React from "react";

const OfferSvg = ({ isActive = false }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      className="transition-all duration-300 group-hover:stroke-white"
    >
      <path
        d="M2.35436 5.25025L2.02313 8.8937C1.97407 9.43329 1.94934 9.70536 1.99425 9.96363C2.03437 10.1944 2.1145 10.4164 2.2314 10.6194C2.36274 10.8474 2.55687 11.0415 2.94292 11.4276L8.11841 16.6031C8.90545 17.3901 9.29918 17.7839 9.7544 17.9318C10.1561 18.0623 10.5895 18.0626 10.9912 17.9321C11.4478 17.7837 11.8446 17.3873 12.6367 16.5953L16.5965 12.6355C17.3885 11.8435 17.7839 11.4476 17.9323 10.991C18.0628 10.5893 18.062 10.1564 17.9315 9.75469C17.7831 9.29803 17.3883 8.90227 16.5963 8.11024L11.4336 2.94751C11.044 2.55795 10.8491 2.36314 10.6201 2.2312C10.4171 2.1143 10.1951 2.03383 9.96431 1.99371C9.70388 1.94842 9.42942 1.97332 8.88075 2.0232L5.25094 2.35318C4.30617 2.43907 3.8335 2.4822 3.46383 2.68777C3.1379 2.86901 2.86921 3.1377 2.68797 3.46363C2.48343 3.83145 2.44076 4.30078 2.35573 5.23614L2.35436 5.25025Z"
        stroke={isActive ? "#ffffff" : "#434343"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="transition-colors duration-300 group-hover:stroke-white"
      />
      <path
        d="M7.31903 7.31819C7.70956 6.92767 7.70956 6.2945 7.31903 5.90398C6.92851 5.51346 6.29489 5.51346 5.90437 5.90398C5.51384 6.2945 5.51347 6.92752 5.90399 7.31804C6.29452 7.70857 6.92851 7.70872 7.31903 7.31819Z"
        stroke={isActive ? "#ffffff" : "#434343"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="transition-colors duration-300 group-hover:stroke-white"
      />
    </svg>
  );
};

export default OfferSvg;
