// import React from "react";
// import ContentLoader from "react-content-loader";

// const Skeleton2 = (props: any) => {
//   return (
//     <ContentLoader
//       className="-mt-3 w-full h-full"
//       viewBox="0 0 1200 500"
//       backgroundColor="#f3f3f3"
//       foregroundColor="#ecebeb"
//       width="100%"
//       height="100%"
//       {...props}
//     >
//       {[...Array(10)].map((_, rowIndex) => (
//         <React.Fragment key={rowIndex}>
//           <rect
//             x="10"
//             y={15 + rowIndex * 50}
//             rx="2"
//             ry="2"
//             width="20"
//             height="20"
//           />
//           <rect
//             x="40"
//             y={11 + rowIndex * 50}
//             rx="5"
//             ry="5"
//             width="150"
//             height="39"
//           />
//           <rect
//             x="230"
//             y={12 + rowIndex * 50}
//             rx="5"
//             ry="5"
//             width="200"
//             height="39"
//           />
//           <rect
//             x="450"
//             y={11 + rowIndex * 50}
//             rx="5"
//             ry="5"
//             width="150"
//             height="39"
//           />
//           <rect
//             x="620"
//             y={12 + rowIndex * 50}
//             rx="5"
//             ry="5"
//             width="200"
//             height="39"
//           />
//           <rect
//             x="840"
//             y={10 + rowIndex * 50}
//             rx="5"
//             ry="5"
//             width="150"
//             height="39"
//           />
//           <rect
//             x="1010"
//             y={9 + rowIndex * 50}
//             rx="5"
//             ry="5"
//             width="180"
//             height="39"
//           />
//         </React.Fragment>
//       ))}
//     </ContentLoader>
//   );
// };

// export default Skeleton2;


"use client";
import React from "react";

// --- PROPS INTERFACE ---
interface CardSkeletonProps {
  /** The number of content columns inside each card. */
  gridCols?: string;
  colsNum?: number;
  /** The number of skeleton cards to render. */
  rows?: number;
  /** Optional additional classes for the outer card container. */
  className?: string;
}

/**
 * A dynamic skeleton loader for grid-based cards.
 * It adapts the number of content placeholders based on the `gridCols` prop.
 */
export default function CardSkeleton({
  gridCols, // Default to 4 columns if not specified
  colsNum = 6,
  rows = 6,
  className = "",
}: CardSkeletonProps) {
  return (
    <>
      {[...Array(rows)].map((_, i) => (
        <div
          key={i}
          className={`bg-white rounded-lg p-2 mb-2 border animate-pulse ${className}`}
        >
          <div className={`grid gap-5 ${gridCols}`}>
            {[...Array(colsNum)].map((_, j) => (
              <div key={j} className="flex justify-center flex-col gap-2">
                <div className="h-4 bg-gray-200 rounded-md w-3/4" />
                {j !== 0 && (
                  <div className="h-4 bg-gray-200 rounded-md w-1/3" />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}