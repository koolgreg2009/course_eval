import React from "react";
import {EvalData} from "../../types/courseEvalTypes";
import {setNumberColors} from "../../hooks/miscHooks";
import ToolTipLabel from "../HomeSearch/ToolTipLabel";
import {ReviewCodeMappings, ReviewCodeKey} from "../../hooks/miscHooks";

interface EvalCardProps {
    item: EvalData;
    children?: React.ReactNode;
    tooltip?: ToolTipLabelProps
}
interface ToolTipLabelProps {
    label: string;
    tooltip: string;
}
const excludedKeys = ['prof_id', 'course_id', 'offering_id', 'eval_id', 'first_name', 'last_name', 'department', 'semester', 'year', 'title', 'section', 'code'];


export const EvalCard = ({item, children, tooltip}:EvalCardProps) =>{
    return(
        <div
            className="card max-w-3xl mx-auto bg-base-200 shadow py-3 mb-6 p-6 rounded-xzl overflow transition-all duration-400">
            {children && (
                <div className="card-header">
                    {children}
                </div>
            )}
            <div className="card-body">
                <h2 className="card-title">{`${item.code}: ${item.year} ${item.semester} ${item.section}`}</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 2xl:grid-cols-12 gap-4">
                    {Object.entries(item).filter(([key]) => !excludedKeys.includes(key)).map(([key, value]) => (
                        <div key={key} className="stat">
                            {key.toUpperCase() in ReviewCodeMappings && (
                                <ToolTipLabel tooltip={ReviewCodeMappings[key.toUpperCase() as ReviewCodeKey]} >
                                    <div className="flex items-center">
                                        <span>{key.toUpperCase()}</span>
                                    </div>
                                </ToolTipLabel>
                            )}
                            <div className={`stat-value text-base ${setNumberColors(key, Number(value))}`}>
                                {typeof value === 'number' ? (Number.isFinite(value) ? value.toFixed(1) : value) : String(value)}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export const EvalCardWithHeader = ({item}:EvalCardProps) =>{
    return(
        <>
            <EvalCard item={item}>
                {(
                    <div className="card-header">
                        <h2 className="text-xl font-bold">{`${item.first_name} ${item.last_name}`}</h2>
                    </div>
                )}
            </EvalCard>
        </>
    )
}
