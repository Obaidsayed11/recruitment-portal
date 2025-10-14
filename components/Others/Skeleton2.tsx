import React from "react";
import ContentLoader from "react-content-loader";

const Skeleton2 = (props: any) => {
  return (
    <ContentLoader
      className="-mt-3 w-full h-full"
      viewBox="0 0 1200 500"
      backgroundColor="#f3f3f3"
      foregroundColor="#ecebeb"
      width="100%"
      height="100%"
      {...props}
    >
      {[...Array(10)].map((_, rowIndex) => (
        <React.Fragment key={rowIndex}>
          <rect
            x="10"
            y={15 + rowIndex * 50}
            rx="2"
            ry="2"
            width="20"
            height="20"
          />
          <rect
            x="40"
            y={11 + rowIndex * 50}
            rx="5"
            ry="5"
            width="150"
            height="39"
          />
          <rect
            x="230"
            y={12 + rowIndex * 50}
            rx="5"
            ry="5"
            width="200"
            height="39"
          />
          <rect
            x="450"
            y={11 + rowIndex * 50}
            rx="5"
            ry="5"
            width="150"
            height="39"
          />
          <rect
            x="620"
            y={12 + rowIndex * 50}
            rx="5"
            ry="5"
            width="200"
            height="39"
          />
          <rect
            x="840"
            y={10 + rowIndex * 50}
            rx="5"
            ry="5"
            width="150"
            height="39"
          />
          <rect
            x="1010"
            y={9 + rowIndex * 50}
            rx="5"
            ry="5"
            width="180"
            height="39"
          />
        </React.Fragment>
      ))}
    </ContentLoader>
  );
};

export default Skeleton2;
