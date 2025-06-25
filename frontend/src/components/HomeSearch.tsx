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
        <div
            className="min-h-screen flex flex-col items-center justify-start bg-base-100 text-base-content px-4 py-20"
        >
            <h1 className="text-3xl font-bold mb-8">search</h1>

            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={mode === 'course' ? 'e.g. MAT137' : 'e.g. Smith'}
                className="w-full max-w-md px-4 py-2 mb-4 bg-base-200 text-base-content rounded shadow focus:outline-none focus:ring-2 focus:ring-primary"
            />

            <label className="swap swap-rotate mb-6">
                <input
                    type="checkbox"
                    checked={mode == 'professor'}
                    onChange={() => {
                        setMode(mode == 'professor' ? 'course' : 'professor');
                        console.log(`Changed to ${mode}`);
                    }}
                />
                <span className="swap-on text-lg font-bold">Professor</span>
                <span className="swap-off text-lg font-bold">Course</span>
            </label>

            {results.length > 0 && (
                <div className="grid grid-cols-5 gap-12">
                    {results.map((item, idx) => (
                        <div
                            key={idx}
                            onClick={() => console.log('clicked')}
                            className="w-fit rounded overflow-hidden bg-base-200 hover:bg-base-300
             transition hover:-translate-y-1 cursor-pointer shadow"
                        >
                            <div className="card w-[22rem] bg-base-200 shadow">
                                <div className="card-body">
                                    <h2 className="card-title">{item.course || item.prof_name}</h2>
                                    <div className="grid grid-cols-4 gap-2 w-full">
                                        <div className="stat">
                                            <div className="stat-title text-xs">INS3</div>
                                            <div className="stat-value text-base">{Number(item.ins3avg).toFixed(2)}</div>
                                        </div>
                                        <div className="stat">
                                            <div className="stat-title text-xs">INS6</div>
                                            <div className="stat-value text-base">{Number(item.ins6avg).toFixed(2)}</div>
                                        </div>
                                        <div className="stat">
                                            <div className="stat-title text-xs">ARTSCI3</div>
                                            <div className="stat-value text-base font-bold">{Number(item.artsci3avg).toFixed(2)}</div>
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
        </div>
    );

};

export default HomeSearch;
