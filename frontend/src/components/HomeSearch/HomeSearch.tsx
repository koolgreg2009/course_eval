import React, {useEffect, useState} from 'react';
import {useHomeSearch} from '../../hooks/homeSearchHook';
import SearchInput from './SearchInput';
import ThumbnailCard from '../EvaluationDisplay/ThumbnailCard';
import {ThumbnailItem, EvalData, RootMode} from "../../types/courseEvalTypes";
import {EvalCard, EvalCardWithHeader} from "../EvaluationDisplay/EvalCard";
import {EvalTable} from "../EvaluationDisplay/EvalTable";
import {BarChart} from "../Plots/FloatingBarChart";
const HomeSearch = () => {
const [mode, setMode] = useState<RootMode>({category: 'course', view: 'evals'});
// Mode determines what user as chosen atm: category being course/prof and view being eval/aggregate
const {
    query, setQuery,
    results, // main display results
    barResults,
    error,
    selectedItem, setSelectedItem,
    evals,
    endpoint,
    handleSearch,
    fetchCourseEvals,
    showHint,
    graphTruncate, toggleGraphTruncate
} = useHomeSearch(mode);

    //const instateEvals = evals[selectedItem!.course_id]?.[selectedItem!.prof_id] ?? [];

    // useEffect(() => { // this fires everytime component refreshes
    //     console.log('Current endpoint:', endpoint);
    // }, [endpoint]);
    //

    const handleKeyDown = (e: React.KeyboardEvent) => {
        /*
        This is called when users search
         */
        // if (e.key === 'Tab' && results.length === 1) {
        //     setQuery(results[0].name || results[0].course_code);
        //     setResults([]); // optionally hide results
        // }
        if (e.key === 'Enter' && query.length >= 3) {
            handleSearch(mode.category, mode.view, query);
        }
    };
    const getInstanceEval = (): EvalData[] => {
        /**
         * Takes no parameter, returns the evaluation object of instate elavulation. The instate eval is stored in
         * selectedItem
         */
        if (!selectedItem) return [];
        return evals[selectedItem.course_id]?.[selectedItem.prof_id] ?? [];
    }

    return (
        <div className="min-h-screen flex flex-col bg-base-100 text-base-content">
            <main className="flex-grow px-4 py-20">

                {/* Centered heading and search input */}
                <div className="flex flex-col items-center">
                    <h1 className="text-3xl font-bold mb-8">search</h1>
                    <SearchInput
                        query={query}
                        setQuery={setQuery}
                        mode={mode}
                        setMode={setMode}
                        handleKeyDown={handleKeyDown}
                        error={error}
                    />
                </div>
                {barResults.length > 0 && (
                    <BarChart
                        category={mode["category"]}
                        values={barResults}
                        target={query}
                        toggleGraphTruncate={toggleGraphTruncate}
                        graphTruncate={graphTruncate}
                    />

                    )
                }
                {/* Results rendering */}
                {results.length > 0 && (
                    mode.view === "evals" ? (
                        <div className="mt-12">
                                <EvalTable
                                    data={results}
                                    category={mode["category"]}
                                />
                        </div>
                    ) : (
                        <div className="w-full overflow-x-auto bg-base-100 mt-12">
                            <div className="flex justify-center">
                                <div className="inline-block">
                                    <div className="grid grid-cols-4 gap-12 place-items-center">
                                    {results.map((item, idx) => (
                                        <ThumbnailCard
                                            key={idx}
                                            item={item}
                                            mode={mode.category}
                                            onClick={() => {
                                                setSelectedItem(item);
                                                fetchCourseEvals(item.course_id, item.prof_id);
                                                (document.getElementById('eval_modal') as HTMLDialogElement)?.showModal();
                                            }}
                                        />
                                    ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                )}

                {/* Modal for viewing evaluation details */}
                <dialog id="eval_modal" className="modal">
                    <div className="modal-box max-w-6xl py-6">
                        <div className="breadcrumbs font-bold text-lg py-6">
                            <ul>
                                <li><a>{mode['category']}</a></li>
                                <li><a>{mode['view']}</a></li>
                                <li><a>{query}</a></li>
                                <li><a>{mode['category'] === 'course' ? selectedItem?.prof_name : selectedItem?.course}</a></li>
                            </ul>
                        </div>
                        {getInstanceEval().map((item: any, idx: number) => (
                            <EvalCard
                                key={idx}
                                item={item}
                            />
                        ))}
                    </div>
                    <form method="dialog" className="modal-backdrop">
                        <button>close</button>
                    </form>
                </dialog>
            </main>

            {/* Page footer */}
            <footer className="w-full p-8 text-center">
                {showHint && (
                    <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                        <b>Please note:</b>
                        <ul className="list-disc list-inside">
                            <li>Not all divisions share their course evaluation data.</li>
                            <li>Instructors within divisions that share data may choose to opt out of making their course evaluation results available.</li>
                            <li>Course evaluation data is not published if fewer than five responses are received, to prevent misinterpretation of data from a very small sample.</li>
                            <li>Course evaluations are completed before the final exam.</li>
                            <li>Data is collected from U of T Course Evaluations. I do not take responsibility of what you do with this data.</li>
                        </ul>
                    </div>
                )}
            </footer>
        </div>
    );


};

export default HomeSearch;
