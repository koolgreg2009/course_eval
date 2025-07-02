import React, {useEffect, useState} from 'react';
import {useHomeSearch} from '../../hooks/homeSearchHook';
import SearchInput from './SearchInput';
import ThumbnailCard from './ThumbnailCard';
import {ThumbnailItem, EvalData, RootMode} from "../../types/courseEvalTypes";
import EvalCard from "./EvalCard";
const HomeSearch = () => {
const [mode, setMode] = useState<RootMode>({category: 'course', view: 'evals'});
// Mode determines what user as chosen atm: category being course/prof and view being eval/aggregate
const {
    query, setQuery,
    results, setResults,
    selectedItem, setSelectedItem,
    evals, setEvals,
    endpoint,
    handleSearch,
    fetchCourseEvals
} = useHomeSearch(mode);

    //const instateEvals = evals[selectedItem!.course_id]?.[selectedItem!.prof_id] ?? [];

    useEffect(() => { // this fires everytime component refreshes
        console.log('Current endpoint:', endpoint);
    }, [endpoint]);


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
        <div
            className="min-h-screen flex flex-col items-center justify-start bg-base-100 text-base-content px-4 py-20"
        >
            <h1 className="text-3xl font-bold mb-8">search</h1>

            <SearchInput
                query={query}
                setQuery={setQuery}
                mode={mode}
                setMode={setMode}
                handleKeyDown={handleKeyDown}
                handleSearch={handleSearch}
                />

            {/*displaying the search results*/}

            {results.length > 0 && ((mode.view === "evals") ? (
                    <div>
                        {
                            results.map((item:any, idx:number) => (
                            <EvalCard
                                key={idx}
                                item={item}>
                            </EvalCard>
                            ))
                        }
                    </div>
                )
                : (
                    <div className="grid grid-cols-5 gap-12">
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

        </div>

    );

};

export default HomeSearch;
