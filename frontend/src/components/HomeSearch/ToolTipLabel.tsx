import React from 'react';

interface ToolTipProps{
    children: React.ReactNode;
    tooltip: string;
}

export const ToolTipLabel = ({children, tooltip}: ToolTipProps) => (
    <span className="stat-title text-xs relative group cursor-pointer">
        {children}
        <span className="
                      absolute
                      top-full
                      mt-10
                      hidden
                      group-hover:block
                      bg-gray-800
                      text-white
                      font-bold
                      text-xs
                      p-2
                      rounded
                      max-w-lg
                      whitespace-normal
                      break-words
                      z-50
                      min-w-[16rem]
                      left-1/2
                      -translate-x-1/2
                    ">
            {tooltip}
        </span>
    </span>
);

export default ToolTipLabel;