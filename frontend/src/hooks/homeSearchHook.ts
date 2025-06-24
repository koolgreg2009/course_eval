import {useState} from "react";


export const useHomeSearch = (mode: 'course' | 'professor') => {
    const [query, setQuery] = useState('');
    // [str, functinon] setquery is a setter for the query string
    // same as above just different names with a type annotation
    const [results, setResults] = useState<any[]>([]);
    const [evals, setEvals] = useState<any[]>([]);
    const endpoint = mode === 'course' ? '/api/courses' : '/api/professors';


    const handleSearch = async () => {
        if (!query.trim()) return;
        try {
            const res = await fetch(`${endpoint}/code?q=${query}`);
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

    const fetchCourseEvals = async (course_id: number, prof_id: number) => {
        if (!evals[course_id][prof_id]) {
            try {
                /*
                Rn query is being set in the tsx file. logic in tsx file: if mode is course then set pass courseid
                 */
                const res = await fetch(`${endpoint}/eval`)
            }catch(err) {

            }
        }
    }

    return {
        query, setQuery,
        results, setResults,
        evals, setEvals,
        endpoint,
        handleSearch,
        fetchCourseEvals
    };
}