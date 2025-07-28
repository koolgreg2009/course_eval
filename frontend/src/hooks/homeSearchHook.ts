import {useEffect, useState} from "react";
import {ThumbnailItem, EvalData, RootMode, Category, View} from "../types/courseEvalTypes";

export const useHomeSearch = (mode: RootMode) => {
    const [query, setQuery] = useState('');
    // [str, functinon] setquery is a setter for the query string
    // same as above just different names with a type annotation

    // stores all evaluations
    const [results, setResults] = useState<any[]>([]);
    // stores results for barchart
    const [barResults, setBarResults] = useState<any[]>([]);

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
    const [demo, setDemo] = useState(true);
    /*
    This is state to hold whether graph should be displayed truncatedly or not
     */
    const [graphTruncate, setGraphTruncate] = useState<boolean>(false);

    const toggleGraphTruncate = ()=> {
        console.log("toggle");
        setGraphTruncate(!graphTruncate)};
    useEffect(() => {
        setResults([]);    // clear previous results immediately
        handleSearch(mode.category, mode.view, query); // this needs to watch both category and view or else it flashes
        // Set instate setGraphTruncate to false since button always starts at false
        setGraphTruncate(false);
    }, [mode]);
    useEffect(() => {
        // Clear Error
        setError(null);
    }, [query, mode]);
    useEffect(() => {
        // when switching between course and professor clear barResults, but want to maintain it between evals and aggregate
        setBarResults([]);
    }, [mode.category])

    // set up the global listener once for toggle d
    useEffect(() => {
        function handleKeyDown(e: KeyboardEvent) {
            if (e.metaKey && e.shiftKey && e.key === "/") {
                e.preventDefault();
                setDemo(prev => !prev);
                console.log("demo toggled");
            }
        }
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    const handleSearch = async (search_category: Category, search_view: View, search_term: String) => {
        console.log("search hit in frontend");
        if (!query.trim()) return;
        setError(null);
            console.log(`search demo: ${demo}`);
        try {
            console.log(`${endpoint}/search?${prefix}=${query}&order_by=year&asc=`)
            const res = await fetch(`${endpoint}?${prefix}=${query}&order_by=year&asc=&demo=${demo}`); // empty asc so desc order
 //           console.log(`${base_url}/api/log/search`);
            await fetch(`${base_url}/api/log/search`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({search_category, search_view, search_term })
            })
            const data = await res.json(); // safe to parse
            if (!res.ok) {
                // This catches error from log/search
                console.log(data);
                setError(data.error);
                return;
            }
            console.log(`data:`, data);
            await fetchBarResults();
            setShowHint(false);
            setResults(data);
        } catch (err) {
            setError(err instanceof Error ? `Failed calling handleSearch ${err.message}` : "Something went wrong");
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
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/evals/search?course_id=${course_id}&prof_id=${prof_id}&order_by=year&asc=&demo=${demo}`);
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
                setError(err instanceof Error ? `Failed calling fetchCourseEvals ${err.message}` : "Something went wrong");

            }
        }
    }
    const fetchBarResults = async () => {
        /*
        This method calls backend to retrieve information needed to display results in barchart. Query params are
        target: a course name or prof name. category: course | professor
         */
        try {
            console.log(`${base_url}/api/evals/bar?target=${query}&category=${mode.category}`);
            const result = await fetch(`${base_url}/api/evals/bar?target=${query}&category=${mode.category}&demo=${demo}`);
            const data = await result.json();

            setBarResults(Object.values(data.rows[0]));
            console.log(Object.values(data.rows[0]));
        }
        catch(err) {
            setError(err instanceof Error ? `Failed calling fetchBarResults ${err.message}` : "Something went wrong");


        }
    }
    /*
        Called by toggle mode
     */
        const demoToggle = () => {
            setDemo(prev => !prev);
        };
    return {
        query, setQuery,
        results, setResults,
        barResults,
        evals, setEvals,
        error, setError,
        selectedItem, setSelectedItem,
        endpoint,
        showHint,
        demo,
        handleSearch,
        fetchCourseEvals,
        graphTruncate, toggleGraphTruncate,
        demoToggle,
    };
}