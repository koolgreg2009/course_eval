import React from 'react';
import * as Tooltip from '@radix-ui/react-tooltip';
interface ToolTipProps{
    children: React.ReactNode;
    tooltip: string;
}



export const ToolTipLabel = ({ children, tooltip }: ToolTipProps) => (
    <Tooltip.Provider>
        <Tooltip.Root>
            <Tooltip.Trigger asChild>
        <span className="stat-title text-xs relative cursor-pointer">
          {children}
        </span>
            </Tooltip.Trigger>
            <Tooltip.Portal>
                <Tooltip.Content
                    sideOffset={10}
                    className="
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
            -translate-x-1/5
            relative
          "
                >
                    {tooltip}
                    <Tooltip.Arrow className="fill-gray-800" />
                </Tooltip.Content>
            </Tooltip.Portal>
        </Tooltip.Root>
    </Tooltip.Provider>
);


export default ToolTipLabel;