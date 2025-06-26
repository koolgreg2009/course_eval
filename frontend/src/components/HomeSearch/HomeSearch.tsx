import React, {useEffect, useState} from 'react';
import {useHomeSearch} from '../../hooks/homeSearchHook';
import SearchInput from './SearchInput';
import ThumbnailCard from './ThumbnailCard';
import {ThumbnailItem, EvalData} from "../../types/courseEvalTypes";
import EvalCard from "./EvalCard";
const HomeSearch = () => {
    const [mode, setMode] = useState<'course' | 'professor'>('course');
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
        if (e.key === 'Tab' && results.length === 1) {
            setQuery(results[0].name || results[0].course_code);
            setResults([]); // optionally hide results
        }
        if (e.key === 'Enter' && query.length >= 3) {
            handleSearch();
        }
    };
    const getInstanceEval = (): EvalData[] => {
        if (!selectedItem) return [];
        // console.log(selectedItem);
        // console.log(evals)
        // console.log(evals[selectedItem.course_id]?.[selectedItem.prof_id]);
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
                />

            {/*displaying the search results*/}
            {results.length > 0 && (
                <div className="grid grid-cols-5 gap-12">
                    {results.map((item, idx) => (
                        <ThumbnailCard
                            key={idx}
                            item={item}
                            onClick={() => {
                                // stores currently selected item instate (1)
                                setSelectedItem(item);
                                fetchCourseEvals(item.course_id, item.prof_id);
                                (document.getElementById('eval_modal') as HTMLDialogElement)?.showModal();
                                }
                            }
                        >
                        </ThumbnailCard>

                    ))}
                </div>
            )}

            <dialog id="eval_modal" className="modal">
                <div className="modal-box max-w-6xl py-6">
                    <div className="breadcrumbs font-bold text-lg py-6">
                    <ul>
                        <li><a>{mode}</a></li>
                        <li><a>{query}</a></li>
                        <li><a>{mode === 'course' ? selectedItem?.prof_name : selectedItem?.course}</a></li>
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
