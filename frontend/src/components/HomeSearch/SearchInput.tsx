import React from 'react';
import {Category, RootMode, View} from '../../types/courseEvalTypes';

interface SearchInputProps {
    query: string;
    setQuery: (query: string) => void;
    mode: RootMode;
    setMode: (mode: RootMode) => void;
    handleKeyDown: (e:React.KeyboardEvent<HTMLInputElement>) => void;
    error: string | null;
}
const CATEGORY_OPTIONS: Category[] = ['course', 'professor'];
const VIEW_OPTIONS: View[] = ['evals', 'aggregate'];

const SearchInput = ({query, setQuery, mode, setMode, handleKeyDown, error}:SearchInputProps) => {
    return(
        <>
            <div className="breadcrumbs text-lg py-4">
                <ul>
                    <li><a>{mode.category}</a></li>
                    <li><a>{mode.view}</a></li>
                    <li><a>{query}</a></li>
                </ul>
            </div>

            {/*Error only shows when error state is non empty*/}
            <div className={error ? "tooltip tooltip-open tooltip-right flex items-center" : ""} data-tip={error || ""}>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={mode.category === 'course' ? 'e.g. MAT137' : 'e.g. Smith'}
                    className="w-full max-w-md px-4 py-2 mb-4 bg-base-200 text-base-content rounded shadow focus:outline-none focus:ring-2 focus:ring-primary"
                />
            </div>


            <div className="flex flex-col items-center gap-4 py-4">
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
                                onChange={() =>
                                    {
                                        setMode({ ...mode,  category: option });
                                        setQuery('');
                                    }
                                } // replaces category
                            />
                        ))}
                    </div>
                </div>

                <div className="flex justify-center">
                    <div className="relative inline-block">
                        <div className="join">
                            {VIEW_OPTIONS.map((option) => (
                                <input
                                    key={option}
                                    className="join-item btn"
                                    type="radio"
                                    name="view-options"
                                    aria-label={option}
                                    checked={mode.view === option}
                                    onChange={() => {
                                        setMode({...mode, view: option});
                                    }}
                                />
                            ))}
                        </div>

                    </div>

                </div>
                {mode.view.includes("aggregate") && (
                    <div className="tooltip tooltip-right" data-tip="Shows average evaluation scores across all offerings for the selected course or professor.">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                             stroke="currentColor" className="size-6">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                  d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"/>
                        </svg>
                    </div>
                )}
            </div>

        </>
    )
};

export default SearchInput;