import {useEffect, useState} from 'react';

const HomeSearch = () => {
    const [query, setQuery] = useState('');
    const [mode, setMode] = useState<'course' | 'professor'>('course');

    const [results, setResults] = useState<any[]>([]);

    const endpoint = mode === 'course' ? '/api/courses/search' : '/api/professors/search';

    useEffect(() => {
        console.log('Current endpoint:', endpoint);
    }, [endpoint]);

    const handleSearch = async () => {
        if (!query.trim()) return;
        try {
            const res = await fetch(`${endpoint}?q=${query}`);
            const data = await res.json();
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
                className="w-full max-w-md px-4 py-2 mb-4 text-black rounded shadow focus:outline-none focus:ring-2 focus:ring-blue-400"
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
                <ul className="w-full max-w-md bg-white text-black rounded-md shadow divide-y divide-gray-300">
                    {results.map((item, idx) => (
                        <li key={idx} className="px-4 py-2 hover:bg-gray-200 cursor-pointer" onClick={() => setQuery(item.name || item.course_code)}>
                            {item.course_code ? `${item.course_code} - ${item.course_name}` : item.name}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default HomeSearch;
