import db from "../db";
import {Request, Response, NextFunction} from "express";
import {Category, View} from "../utils/typeDef"
import { AppError } from '../utils/AppError';

export const logSearch = async (search_category: Category, search_view: View, search_term: string) => {
    try {
        await db.query(
            `
                INSERT INTO search_log(search_category, search_view, search_term)
                VALUES ($1, $2, $3)
            `, [search_category, search_view, search_term]);
    } catch (error) {
        throw new AppError('Failed writing to log table in logSearch');
    }
}

export const logSearchHTTP = async (req: Request, res: Response, next: NextFunction) => {
    console.log("LOGSEARCH HIT");
    try{
        const {search_category, search_view, search_term} = req.body
        //console.log(search_category, search_view, search_term);
        await logSearch(search_category as Category, search_view as View, String(search_term));
        res.status(200).send("Logged");
    } catch(error){
        // console.error("Error logging search", error);
        next(error)
    }

}
// add route to index.ts later
// extract variables into {} and pass them in