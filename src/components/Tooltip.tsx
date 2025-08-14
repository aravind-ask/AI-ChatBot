import React, { useState } from "react";

export function Tooltip({
  children,
  content,
}: {
  children: React.ReactNode;
  content: string;
}) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </div>
      {isVisible && (
        <div className="absolute z-50 left-1/2 transform -translate-x-1/2 bottom-full mb-2 px-3 py-2 text-xs font-medium text-gray-100 bg-gray-800 rounded-lg shadow-lg border border-gray-700 whitespace-nowrap">
          {content}
          <div className="absolute left-1/2 top-full transform -translate-x-1/2 w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-gray-800"></div>
        </div>
      )}
    </div>
  );
}
