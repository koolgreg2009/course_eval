import React from 'react';
import { Bar } from 'react-chartjs-2';
import { ChartOptions } from 'chart.js';

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import {Category} from "../../types/courseEvalTypes";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
interface BarChartProps {
    /*
    category: prof or course
    values: values of ins1, ... artsci1, ...
    target: eg. mat137, diane horton
     */
    category: Category;
    values: number[],
    target: string,
    toggleGraphTruncate: any
    graphTruncate: boolean
}
export const BarChart = ({category, values, target, toggleGraphTruncate, graphTruncate}: BarChartProps) => {
    const yMin: number = graphTruncate ? 3 : 0;
    const stepSize: number = graphTruncate ? 0.5 : 1;
    const data =
    (category == "course" ?
            {
                labels: ['INS1', 'INS6', 'ARTSCI2', 'ARTSCI3'],
                datasets: [
                    {
                        // label: 'score',
                        data: values,
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.5)',
                            'rgba(54, 162, 235, 0.5)',
                            'rgba(255, 206, 86, 0.5)',
                            'rgba(75, 192, 192, 0.5)'
                        ],
                    },
                ],
            }
         :
            { // else professor
                labels: ['INS3', 'INS6', 'ARTISCI1'],
                datasets: [
                    {
                        // label: 'score',
                        data: values,
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.5)',
                            'rgba(54, 162, 235, 0.5)',
                            'rgba(255, 206, 86, 0.5)',
                        ],
                    },
                ],
            }
    );


    const options: ChartOptions<'bar'> = {
        responsive: true,
        plugins: {
            legend: {
                display: false
            },
            title: {
                display: true,
                text: `${target}'s aggregated statistics`,
            },
        },
        scales: {
            y: {
                min: yMin,
                max: 5,
                ticks: {
                    callback: function (value) {
                        return Number(value).toFixed(1);
                    },
                    stepSize: stepSize
                },
            },
        },


    };


    return (
        <div className="relative w-full h-[400px]">
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="relative">
                    <div className="w-[600px] h-[400px]">
                        <Bar data={data} options={options} />
                    </div>

                </div>
                <div className="absolute top-1/2 left-full ml-4 -translate-y-1/2 flex flex-col space-y-2">
                    <input className="join-item btn btn-xs"
                           type="radio"
                           name="choices"
                           aria-label="Full"
                           onChange={toggleGraphTruncate}
                           defaultChecked

                    />
                    <input className="join-item btn btn-xs w-20"
                           type="radio"
                           name="choices"
                           aria-label="Axis Break"
                           onChange={toggleGraphTruncate}

                    />
                </div>
            </div>
        </div>
    );
};
