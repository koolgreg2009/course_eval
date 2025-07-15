import React from "react";
import {Category, ThumbnailItem} from "../../types/courseEvalTypes";
import {setNumberColors} from "../../hooks/miscHooks";
import ToolTipLabel from "../HomeSearch/ToolTipLabel";

interface thumbnailCardProps {
    item: ThumbnailItem
    mode: Category
    onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
}
const statTuple = (tooltip: string, label: string, value: number, key: number) => {
    return (
        <div className="stat" key={key}>
            <ToolTipLabel tooltip={tooltip}>
                <div className="flex items-center">
                    {label}
                </div>
            </ToolTipLabel>
            <div className={`stat-value text-base ${setNumberColors("", value)}`}>{value.toFixed(2)}</div>
        </div>
    )
}
const ThumbnailCard = ({item, mode, onClick}:thumbnailCardProps) => {
    return(
        <>
            <div className="w-fit rounded overflow relative bg-base-800 hover:bg-base-900
             transition hover:-translate-y-1 cursor-pointer shadow"
                 onClick={onClick} >

                <div className="card w-[22rem] bg-base-200 shadow">
                    <div className="card-body">
                        <h2 className="card-title">{item.course || item.prof_name}</h2>
                        <div className="grid grid-cols-4 gap-2 w-full">
                            {[
                                statTuple("Instructor created a course atmosphere that was conducive to my learning.", "INS3", Number(item.ins3avg), 0),
                                statTuple("Overall, the quality of my learning experience in this course was:", "INS6", Number(item.ins6avg), 1),
                                statTuple("The instructor generated enthusiasm for learning in the course.", "ARTSCI1", Number(item.artsci1avg), 2)
                            ]}
                            <div className="stat">
                                <div className="stat-title text-xs">Taught</div>
                                <div className="stat-value text-base text-primary">{item.times_taught}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default ThumbnailCard;
