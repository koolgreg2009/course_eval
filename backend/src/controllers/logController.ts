import db from "../db";
import {Request, Response} from "express";
import {Category, View} from "../utils/typeDef"

export const logSearch = async (search_category: Category, search_view: View, search_term: string) => {
    await db.query(
        `
    INSERT INTO search_log(search_category, search_view, search_term, timestamp) 
    VALUES ($1, $2, $3, NOW())
    `, [search_category, search_view, search_term]);

}

export const logSearchHTTP = async (req: Request, res: Response) => {
    console.log("LOGSEARCH HIT");
    try{
        const {search_category, search_view, search_term} = req.body
        //console.log(search_category, search_view, search_term);
        await logSearch(search_category as Category, search_view as View, String(search_term));
        res.status(200).send("Logged");
    } catch(error){
        // console.error("Error logging search", error);
        res.status(500).send("Error logging search");
    }

}
// add route to index.ts later
// extract variables into {} and pass them in