import React, {useEffect, useState} from 'react';
import {useHomeSearch, SelectedItem, EvalData} from '../../hooks/homeSearchHook';
import SearchInput from './SearchInput';

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
        if (e.key === 'Enter') {
            handleSearch();
        }
    };
    const getInstanceEval = (): EvalData[] => {
        if (!selectedItem) return [];
        console.log(selectedItem);
        console.log(evals)
        console.log(evals[selectedItem.course_id]?.[selectedItem.prof_id]);
        return evals[selectedItem.course_id]?.[selectedItem.prof_id] ?? [];

    }
    const excludedKeys = ['prof_id', 'course_id', 'offering_id', 'eval_id', 'first_name', 'last_name', 'department', 'semester', 'year', 'title', 'section', 'code'];

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
                        <div
                            key={idx}
                            onClick={() => {
                                // stores currently selected item instate (1)
                                setSelectedItem(item);
                                fetchCourseEvals(item.course_id, item.prof_id);
                                (document.getElementById('eval_modal') as HTMLDialogElement)?.showModal();
                                }
                            }
                            className="w-fit rounded overflow-hidden bg-base-200 hover:bg-base-300
             transition hover:-translate-y-1 cursor-pointer shadow"
                        >
                            <div className="card w-[22rem] bg-base-200 shadow">
                                <div className="card-body">
                                    <h2 className="card-title">{item.course || item.prof_name}</h2>
                                    <div className="grid grid-cols-4 gap-2 w-full">
                                        <div className="stat">
                                            <div className="stat-title text-xs">INS3</div>
                                            <div className="stat-value text-base text-secondary">{Number(item.ins3avg).toFixed(2)}</div>
                                        </div>
                                        <div className="stat">
                                            <div className="stat-title text-xs">INS6</div>
                                            <div className="stat-value text-base text-secondary">{Number(item.ins6avg).toFixed(2)}</div>
                                        </div>
                                        <div className="stat">
                                            <div className="stat-title text-xs">ARTSCI3</div>
                                            <div className="stat-value text-base font-bold text-secondary">{Number(item.artsci3avg).toFixed(2)}</div>
                                        </div>
                                        <div className="stat">
                                            <div className="stat-title text-xs">Taught</div>
                                            <div className="stat-value text-base text-primary">{item.times_taught}</div>
                                        </div>
                                    </div>

                                </div>
                            </div>


                        </div>

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
                                    <div
                                        key={idx}
                                        className="card w-[80rem] w-full bg-base-200 shadow py-3 mb-6 p-6 rounded-xl overflow-hidden transition-all duration-400">
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
