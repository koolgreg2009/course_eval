import React, {useEffect, useState} from 'react';
import {useHomeSearch} from '../../hooks/homeSearchHook';
import SearchInput from './SearchInput';
import ThumbnailCard from './ThumbnailCard';
import {ThumbnailItem, EvalData, RootMode} from "../../types/courseEvalTypes";
import {EvalCard, EvalCardWithHeader} from "./EvalCard";
const HomeSearch = () => {
const [mode, setMode] = useState<RootMode>({category: 'course', view: 'evals'});
// Mode determines what user as chosen atm: category being course/prof and view being eval/aggregate
const {
    query, setQuery,
    results,
    error,
    selectedItem, setSelectedItem,
    evals,
    endpoint,
    handleSearch,
    fetchCourseEvals,
    showHint,
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
            handleSearch();
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
        <div className="min-h-screen flex flex-col items-center justify-start bg-base-100 text-base-content px-4 py-20">
            <h1 className="text-3xl font-bold mb-8">search</h1>

            <SearchInput
                query={query}
                setQuery={setQuery}
                mode={mode}
                setMode={setMode}
                handleKeyDown={handleKeyDown}
                error={error}
                />
            {/*displaying the search results*/}

            {results.length > 0 && ((mode.view === "evals") ? (
                    <div>
                        {
                            results.map((item:any, idx:number) => (
                            <EvalCardWithHeader
                                key={idx}
                                item={item}>
                            </EvalCardWithHeader>
                            ))
                        }
                    </div>
                )
                : (
                    <div className="grid grid-cols-4 gap-12">
                        {results.map((item, idx) => (
                            <ThumbnailCard
                                key={idx}
                                item={item}
                                onClick={() => {
                                    // stores currently selected item object instate (1)
                                    setSelectedItem(item);
                                    // Retrieves corresponding evaluations
                                    fetchCourseEvals(item.course_id, item.prof_id);
                                    // Display modals
                                    (document.getElementById('eval_modal') as HTMLDialogElement)?.showModal();
                                    }
                                }
                            >
                            </ThumbnailCard>
                            )
                        )
                        }
                    </div>
                    )
                )
            }
            {/* This is the pop up modal for each thumbnail*/}
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
                        {
                            getInstanceEval().map((item:any, idx:number) => (
                                <EvalCard
                                    key={idx}
                                    item={item}>
                                </EvalCard>

                            ))
                        }
                    </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>

            <div className="fixed bottom-0 w-full p-8 text-center">
                {showHint &&
                    (
                        <footer style={{ marginTop: '2rem', textAlign: 'center' }}>
                            <p> Please note:
                                <ul className="list-disc list-inside">
                                    <li> Not all divisions share their course evaluation data. </li>
                                    <li> Instructors within divisions that share data may choose to opt out of making their course evaluation results available. </li>
                                    <li> Course evaluation data is not published if fewer than five responses are received, to prevent misinterpretation of data from a very small sample.</li>
                                    <li> Course evaluations are completed before the final exam. </li>
                                    <li> Data is collected from U of T Course Evaluations. I do not take responsibility of what you do with this data.</li>
                                </ul>
                            </p>
                        </footer>
                    )
                }
            </div>


        </div>


    );

};

export default HomeSearch;
