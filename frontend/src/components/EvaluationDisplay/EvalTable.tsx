import React from "react";
import {Category, EvalData} from "../../types/courseEvalTypes";
import {EvalRow} from "./EvalRow";
import {ToolTipLabelProps} from "../../types/courseEvalTypes"
import {ReviewCodeKey, ReviewCodeMappings} from "../../hooks/miscHooks";
import ToolTipLabel from "../HomeSearch/ToolTipLabel";

interface EvalRowProps {
    data: EvalData[],
    category: Category,
    children?: React.ReactNode,
    tooltip?: ToolTipLabelProps,
    item?: any[]
}

export const EvalTable = ({data, category, children, tooltip, item}: EvalRowProps) => {
    return (
        <section className="container px-4 mx-auto">
            <div className="flex flex-col mt-6">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle text-center md:px-6 lg:px-8">
                        <div className="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-gray-800 sticky top-0 z-10">
                                <tr>
                                    <th className="py-3.5 px-4 text-sm font-normal text-center text-gray-500 dark:text-gray-400">
                                        {category == "course" ? "Professor" : "Course"}
                                    </th>
                                    <th className="px-4 py-3.5 text-sm font-normal text-center text-gray-500 dark:text-gray-400">
                                        Section
                                    </th>
                                    {["INS1", "INS2", "INS3", "INS4", "INS5", "INS6", "ARTSCI1", "ARTSCI2", "ARTSCI3", "INVITED", "RESPONDED"].map(col => {
                                        const upperKey = col.toUpperCase();
                                        const tooltip = ReviewCodeMappings[upperKey as ReviewCodeKey];

                                        return (
                                            <th
                                                key={col}
                                                className="px-5 text-sm font-normal text-center text-gray-500 dark:text-gray-400"
                                            >
                                                {tooltip ? (
                                                    <ToolTipLabel tooltip={tooltip}>
                                                        <div className="flex items-center">
                                                            <span>{col}</span>
                                                        </div>
                                                    </ToolTipLabel>
                                                ) : (
                                                    col
                                                )}
                                            </th>
                                        );
                                    })}

                                    <th className="relative py-3.5 px-4">
                                        <span className="sr-only">Edit</span>
                                    </th>
                                </tr>
                                </thead>

                                <tbody
                                    className="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
                                    {data.map((item: EvalData, idx: number) => (
                                        <EvalRow key={idx} item={item} category={category} />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
