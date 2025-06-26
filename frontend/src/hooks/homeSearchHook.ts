import {useState} from "react";
import {ThumbnailItem, EvalData} from "../types/courseEvalTypes";

export const useHomeSearch = (mode: 'course' | 'professor') => {
    const [query, setQuery] = useState('');
    // [str, functinon] setquery is a setter for the query string
    // same as above just different names with a type annotation
    const [results, setResults] = useState<any[]>([]);
    // stores all evaluations
    const [evals, setEvals] =  useState<{[course_id: number]: {[prof_id: number]: EvalData[]}}>({});
    // stores the current element.
    const [selectedItem, setSelectedItem] = useState<ThumbnailItem | null>(null);
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
        if (!evals[course_id]) {
            /*
            If evals[course_id] dne js wont create missing value, so must create manually.
             */
            evals[course_id] = {};
        }
        if (!evals[course_id][prof_id]) {
            try {
                /*
                Rn query is being set in the tsx file. logic in tsx file: if mode is course then set pass courseid
                 */
                const res = await fetch(`/api/evals/${course_id}/${prof_id}`);
                const data = await res.json();
                setEvals(prev => ({
                    ...prev,
                    [course_id]: {
                        ...(prev[course_id] || {}),
                        [prof_id]: data.rows
                    }
                }));


                console.log(evals[course_id][prof_id]);
            }catch(err) {
                console.error('Get evals failed:', err);

            }
        }
    }

    return {
        query, setQuery,
        results, setResults,
        evals, setEvals,
        selectedItem, setSelectedItem,
        endpoint,
        handleSearch,
        fetchCourseEvals
    };
}