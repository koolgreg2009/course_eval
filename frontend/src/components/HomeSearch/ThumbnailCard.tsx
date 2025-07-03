import React from "react";
import {ThumbnailItem} from "../../types/courseEvalTypes";
import {setNumberColors} from "../../hooks/miscHooks";
import ToolTipLabel from "./ToolTipLabel";

interface thumbnailCardProps {
    item: ThumbnailItem
    onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const ThumbnailCard = ({item, onClick}:thumbnailCardProps) => {
    return(
        <>
            <div className="w-fit rounded overflow relative bg-base-200 hover:bg-base-300
             transition hover:-translate-y-1 cursor-pointer shadow"
                 onClick={onClick} >

                <div className="card w-[22rem] bg-base-200 shadow">
                    <div className="card-body">
                        <h2 className="card-title">{item.course || item.prof_name}</h2>
                        <div className="grid grid-cols-4 gap-2 w-full">
                            <div className="stat">
                                <ToolTipLabel tooltip="Instructor created a course atmosphere that was conducive to my learning.">
                                    <div className="flex items-center">
                                        <span>INS3</span>
                                    </div>
                                </ToolTipLabel>
                                <div className={`stat-value text-base overflow-hidden ${setNumberColors(Number(item.ins3avg))}`}>{Number(item.ins3avg).toFixed(2)}</div>
                            </div>
                            <div className="stat">
                                <ToolTipLabel tooltip="Overall, the quality of my learning experience in this course was:">
                                    <div className="flex items-center">
                                        INS6
                                    </div>
                                </ToolTipLabel>
                                <div className={`stat-value text-base ${setNumberColors(Number(item.ins6avg))}`}>{Number(item.ins6avg).toFixed(2)}</div>
                            </div>
                            <div className="stat">
                                <ToolTipLabel tooltip="I would recommend this course to other students.">
                                    <div className="flex items-center">
                                        ARTSCI3
                                    </div>
                                </ToolTipLabel>
                                <div
                                    className={`stat-value text-base ${setNumberColors(Number(item.artsci3avg))}`}>{Number(item.artsci3avg).toFixed(2)}</div>
                            </div>
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
