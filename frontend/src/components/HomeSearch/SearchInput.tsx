import React from 'react';

interface SearchInputProps {
    query: string;
    setQuery: (query: string) => void;
    mode: 'course' | 'professor';
    setMode: (mode: 'course' | 'professor') => void;
    handleKeyDown: (e:React.KeyboardEvent<HTMLInputElement>) => void;
}
const SearchInput = ({query, setQuery, mode, setMode, handleKeyDown}:SearchInputProps) => {
    return(
        <>
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
            <div className="breadcrumbs text-lg py-6">
                <ul>
                    <li><a>{mode}</a></li>
                    <li><a>{query}</a></li>
                </ul>
            </div>
        </>
        )
};

export default SearchInput;