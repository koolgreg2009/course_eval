import {useEffect, useState} from 'react';

const HomeSearch = () => {
    const [query, setQuery] = useState('');
    // [str, functinon] setquery is a setter for the query string
    const [mode, setMode] = useState<'course' | 'professor'>('course');
    // same as above just different names with a type annotation
    const [results, setResults] = useState<any[]>([]);

    const endpoint = mode === 'course' ? '/api/courses/search' : '/api/professors/search';

    useEffect(() => {
        console.log('Current endpoint:', endpoint);
    }, [endpoint]);

    const handleSearch = async () => {
        if (!query.trim()) return;
        try {
            const res = await fetch(`${endpoint}?q=${query}`);
            console.log(`${endpoint}?q=${query}`) // ?q= gets put into req.query.q
            if (!res.ok) {
                const errorText = await res.text();
                console.error(`HTTP ${res.status}:`, errorText);
                return;
            }

            const data = await res.json(); // safe to parse
            console.log(data);

            setResults(data);
        } catch (err) {

            console.error('Search failed:', err);
        }
    };


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

            <div className="flex items-center justify-center gap-8 mb-8">
                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="radio"
                        name="mode"
                        value="course"
                        checked={mode === 'course'}
                        onChange={() => {
                            console.log('Changed to course');
                            setMode('course')}}
                        className="accent-blue-500"
                    />
                    Course
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="radio"
                        name="mode"
                        value="professor"
                        checked={mode === 'professor'}
                        onChange={() => {
                            console.log('Changed to professor');
                            setMode('professor')
                        }}
                        className="accent-green-500"
                    />
                    Professor
                </label>
            </div>

            {results.length > 0 && (
                <div className="flex flex-col gap-4 overflow-y-auto h-96 w-full max-w-6xl bg-slate-800 text-white p-4 rounded-md shadow">
                    {results.map((item) => (
                        <div
                            key={item.prof_id}
                            className="flex flex-wrap gap-x-6 gap-y-2 bg-gray-800 px-4 py-2 rounded shadow hover:bg-gray-700"
                        >
                            {Object.entries(item)
                                .filter(([key]) => key !== 'prof_id')
                                .map(([key, value]) => {
                                    const displayVal =
                                        typeof value === 'number' ? value.toFixed(2) : String(value);
                                    return (
                                        <div key={key} className="whitespace-nowrap text-sm">
                                            <strong>{key}:</strong> {displayVal}
                                        </div>
                                    );
                                })}
                        </div>
                    ))}
                </div>

            )}
        </div>
    );
};

export default HomeSearch;
