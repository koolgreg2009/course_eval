import {useEffect, useState} from 'react';
import {useHomeSearch} from '../hooks/homeSearchHook';

const HomeSearch = () => {
    const [mode, setMode] = useState<'course' | 'professor'>('course');
    const {
        query, setQuery,
        results, setResults,
        endpoint,
        handleSearch
    } = useHomeSearch(mode);

    useEffect(() => { // this fires everytime component refreshes
        console.log('Current endpoint:', endpoint);
    }, [endpoint]);


    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Tab' && results.length === 1) {
            setQuery(results[0].name || results[0].course_code);
            setResults([]); // optionally hide results
        }
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-start bg-slate-900 text-white px-4 py-20">

            <h1 className="text-3xl font-bold mb-8">search</h1>

            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={mode === 'course' ? 'e.g. MAT137' : 'e.g. Smith'}
                className="w-full max-w-md px-4 py-2 mb-4 text-white rounded shadow focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <label className="swap swap-rotate mb-6">
                <input
                    type="checkbox"
                    checked={mode == 'professor'}
                    onChange={() => {
                        setMode(mode == 'professor' ? 'course' : 'professor');
                        console.log(`Changed to ${mode}`)
                        }
                    }
                />
                <span className="swap-on text-lg font-bold">Professor</span>
                <span className="swap-off text-lg font-bold">Course</span>
            </label>

            {results.length > 0 && (
                <div className="join join-vertical bg-base-100">
                    {results.map((item, idx) => ( // each item is a singular dict
                        <div
                            key={idx}
                            className="collapse collapse-arrow join-item border border-base-300"
                        >
                            <input type="radio" name="my-accordion-4"  />
                            <div className="collapse-title font-semibold">
                                {item.prof_name || item.course}
                            </div>
                            <div className="collapse-content text-sm">A</div>
                            <div className="collapse-content text-sm">
                                {/*<div className="flex flex-wrap gap-x-6 gap-y-2 bg-gray-800 px-4 py-2 rounded shadow hover:bg-gray-700">*/}
                                {/*    {Object.entries(item)*/}
                                {/*        .filter(([key]) => key !== 'prof_id' && key !== 'course_id')*/}
                                {/*        .map(([key, value]) => {*/}
                                {/*            const displayVal =*/}
                                {/*                typeof value === 'number' ? value.toFixed(2) : String(value);*/}
                                {/*            return (*/}
                                {/*                <div key={key} className="whitespace-nowrap text-sm text-white">*/}
                                {/*                    <strong>{key}:</strong> {displayVal}*/}
                                {/*                </div>*/}
                                {/*            );*/}
                                {/*        })}*/}
                                {/*</div>*/}

                            </div>
                        </div>
                    ))}
                </div>



            )}
        </div>
    );
};

export default HomeSearch;
