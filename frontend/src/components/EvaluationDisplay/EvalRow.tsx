import React from "react";
import {Category, EvalData} from "../../types/courseEvalTypes";
import {setNumberColors} from "../../hooks/miscHooks";

const excludedKeys = [
    'prof_id', 'course_id', 'offering_id', 'eval_id',
    'first_name', 'last_name', 'department',
    'code', 'title', 'section', 'year', 'semester'
];

export const EvalRow = ({item, category }: { item: EvalData, category: Category }) => {
    const includedEntries = Object.entries(item).filter(([key]) => !excludedKeys.includes(key));

    return (
        <tr>
            {/* Instructor Name or Course*/}
            <td className="px-4 py-4 text-sm font-medium whitespace-nowrap">
    <div className="py-2 px-2 text-lg font-bold">
        {category == "course" ? `${item.first_name} ${item.last_name}` : item.code}
    </div>
    </td>

    {/* Course Info */}
    <td className="px-4 py-4 text-sm font-medium whitespace-nowrap">
    <div>
        <h2 className="font-medium text-gray-800 dark:text-white">{item.section}</h2>
        <p className="text-sm font-normal text-gray-600 dark:text-gray-400">{`${item.year} ${item.semester}`}</p>
    </div>
    </td>

    {/* Dynamically Render Included Metrics */}
    {includedEntries.map(([key, value]) => (
        <td key={key} className="py-4 text-sm text-bold whitespace-nowrap">
            <div className={`inline px-3 py-1 text-sm font-bold rounded-full gap-x-2 bg-emerald-100/60 dark:bg-gray-800 ${setNumberColors(key, Number(value))}`}>{typeof value === 'number' ? value.toFixed(1) : value}</div>
        </td>
    ))}

    {/* Action button */}
    <td className="px-4 py-4 text-sm whitespace-nowrap">
    <button className="px-1 py-1 text-gray-500 transition-colors duration-200 rounded-lg dark:text-gray-300 hover:bg-gray-100">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
        </svg>
        </button>
        </td>
        </tr>
);
};
