import React from "react";
import {EvalData} from "../../types/courseEvalTypes";

interface EvalCardProps {
    item: EvalData;
}
const excludedKeys = ['prof_id', 'course_id', 'offering_id', 'eval_id', 'first_name', 'last_name', 'department', 'semester', 'year', 'title', 'section', 'code'];


const EvalCard = ({item}:EvalCardProps) => {
    return(
        <>
            <div
                className="card w-full bg-base-200 shadow py-3 mb-6 p-6 rounded-xl overflow-hidden transition-all duration-400">
                <div className="card-body">
                    <h2 className="card-title">{`${item.code}: ${item.year} ${item.semester} ${item.section}`}</h2>

                    <div className="grid grid-cols-14 gap-2 w-[78rem]">
                        {Object.entries(item).filter(([key]) => !excludedKeys.includes(key)).map(([key, value]) => (
                            <div key={key} className="stat">
                                <div className="stat-title text-xs">{key.toUpperCase()}</div>
                                <div className="stat-value text-base text-secondary">
                                    {typeof value === 'number' ? (Number.isFinite(value) ? value.toFixed(2) : value) : String(value)}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </>
    )
}

export default EvalCard;