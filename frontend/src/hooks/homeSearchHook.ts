import {useEffect, useState} from "react";
import {ThumbnailItem, EvalData, RootMode, Category, View} from "../types/courseEvalTypes";

export const useHomeSearch = (mode: RootMode) => {
    const [query, setQuery] = useState('');
    // [str, functinon] setquery is a setter for the query string
    // same as above just different names with a type annotation
    const [results, setResults] = useState<any[]>([]);
    // stores all evaluations
    const [evals, setEvals] =  useState<{[course_id: number]: {[prof_id: number]: EvalData[]}}>({});
    // stores the current element.
    const [selectedItem, setSelectedItem] = useState<ThumbnailItem | null>(null);
    // Prefix for the main query arg.
    const prefix: string = (mode.category === 'course') ? 'course_name' : 'prof_name';
    // @ts-ignore
    const base_url = import.meta.env.VITE_API_URL;
    const endpoint: string = `${base_url}/api/${mode.category}s/${mode.view}`;
    const [error, setError] = useState<string | null>(null);
    const [showHint, setShowHint] = useState(true);

    useEffect(() => {
        setResults([]);    // clear previous results immediately
    }, [mode]);
    useEffect(() => { // fetches new data into result
        handleSearch(mode.category, mode.view, query);
    }, [mode.category, mode.view]);
    useEffect(() => {
        setError(null);
    }, [query, mode]);

    const handleSearch = async (search_category: Category, search_view: View, search_term: String) => {
        console.log("search hit in frontend");
        if (!query.trim()) return;
        setError(null);
        try {
            // console.log(`Fetching: ${endpoint}?${prefix}=${query}`) // ?q= gets put into req.query.q
    //        console.log(`${endpoint}?${prefix}=${query}&order_by=year&asc=`);
            const res = await fetch(`${endpoint}?${prefix}=${query}&order_by=year&asc=`); // empty asc so desc order
 //           console.log(`${base_url}/api/log/search`);
            await fetch(`${base_url}/api/log/search`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({search_category, search_view, search_term })
            })
            if (!res.ok) {
                const errorBody = await res.json();
                throw new Error(errorBody.error || "Something went wrong");
            }

            const data = await res.json(); // safe to parse
            // console.log(`data:`, data);

            setShowHint(false);
            setResults(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong");
        }
    };

    const fetchCourseEvals = async (course_id: number, prof_id: number) => {
        /*
            If eval doesnt exist in react's useState, fetch from db. Else do nothing
         */
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
                // @ts-ignore
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/evals?course_id=${course_id}&prof_id=${prof_id}&order_by=year&asc=`);
                const data = await res.json();
                setEvals(prev => ({
                    ...prev,
                    [course_id]: {
                        ...(prev[course_id] || {}),
                        [prof_id]: data.rows
                    }
                }));

                // console.log(data.rows);
                // console.log(`hi: `, course_id, prof_id, evals[course_id][prof_id]);
            }catch(err) {
                // console.error('Get evals failed:', err);

            }
        }
    }

    return {
        query, setQuery,
        results, setResults,
        evals, setEvals,
        error, setError,
        selectedItem, setSelectedItem,
        endpoint,
        showHint,
        handleSearch,
        fetchCourseEvals,
    };
}