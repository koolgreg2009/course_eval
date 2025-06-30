import React from 'react';
import {Category, RootMode, View} from '../../types/courseEvalTypes';

interface SearchInputProps {
    query: string;
    setQuery: (query: string) => void;
    mode: RootMode;
    setMode: (mode: RootMode) => void;
    handleKeyDown: (e:React.KeyboardEvent<HTMLInputElement>) => void;
}
const CATEGORY_OPTIONS: Category[] = ['course', 'professor'];
const VIEW_OPTIONS: View[] = ['evals', 'aggregate'];

const SearchInput = ({query, setQuery, mode, setMode, handleKeyDown}:SearchInputProps) => {
    return(
        <>
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={mode.category === 'course' ? 'e.g. MAT137' : 'e.g. Smith'}
                className="w-full max-w-md px-4 py-2 mb-4 bg-base-200 text-base-content rounded shadow focus:outline-none focus:ring-2 focus:ring-primary"
            />

            {/* Category selector */}
            <div className="mb-6">
                <div className="join">
                    {CATEGORY_OPTIONS.map((option) => (
                        <input
                            key={option}
                            className="join-item btn"
                            type="radio"
                            name="category-options"
                            aria-label={option}
                            checked={mode.category === option}
                            onChange={() => setMode({ ...mode,  category: option })}
                        />
                    ))}
                </div>
            </div>

            {/* View selector */}
            <div className="mb-6">
                <div className="join">
                    {VIEW_OPTIONS.map((option) => (
                        <input
                            key={option}
                            className="join-item btn"
                            type="radio"
                            name="view-options"
                            aria-label={option}
                            checked={mode.view === option}
                            onChange={() => setMode({ ...mode, view: option})}
                        />
                    ))}
                </div>
            </div>

            <div className="breadcrumbs text-lg py-6">
                <ul>
                    <li><a>{mode.category}</a></li>
                    <li><a>{mode.view}</a></li>
                    <li><a>{query}</a></li>
                </ul>
            </div>
        </>
        )
};

export default SearchInput;