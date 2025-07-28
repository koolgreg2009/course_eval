import { Request, Response, NextFunction } from 'express';
import db from '../db';
import {fetchEvaluations,} from "./evalController";
import { AppError } from '../utils/AppError';


export async function getProfByName(prof_name: string, tablePrefix: string){
    /*
       Retrieves prof_id based on input string. Returns prof_id if there is 1 result. Else raise error.
     */

    console.log("in getProfByName");
    const result = await db.query(`
                SELECT p.prof_id
                FROM ${tablePrefix}professors p
                WHERE LOWER(CONCAT(p.first_name, ' ', p.last_name)) LIKE LOWER($1);
        `,
        [`%${prof_name}%`]);
    console.log(`Number of professors: ${result.rows.length}`);
    if (result.rows.length > 1){
        throw new AppError('Ambiguous: Input maps to multiple results', 409);
    } else if(result.rows.length === 0) {
        throw new AppError('Unknown professor', 404);
    }
    return result.rows[0];

}

export const getCourseEvalByProfName = async (req: Request, res: Response, next: NextFunction) => {
    const {prof_name, order_by, asc, demo} = req.query;
    const tablePrefix: string = demo === "true" ? "demo_" : ""

    const prof_id_result = await getProfByName(String(prof_name), tablePrefix);

    try{
        const eval_result = await fetchEvaluations({prof_id: prof_id_result.prof_id, order_by: order_by, asc: asc, demo: String(demo)});
        res.json(eval_result.rows);
    } catch(error){
        console.log("getCourseEval failed")
        next(error);
    }

}
export const getProfByCode = async (req: Request, res: Response, next: NextFunction) => {
    /**
     * Searches for a prof by name. Returns some aggregational statistics of them
     */
    debugger;
//    console.log('✅ Backend hit in prof! query =', req.query.prof_name);
    const {prof_name, demo} = req.query;
    const tablePrefix: string = demo === "true" ? "demo_" : ""

    try {
        const result = await db.query(
            `
                SELECT p.prof_id,
                       c.course_id,
                       CONCAT(p.first_name, ' ', p.last_name) AS "name",
                       c.code                                 AS course,
                       AVG(e.ins3)                            AS INS3Avg,
                       AVG(e.ins6)                            AS INS6AVG,
                       AVG(e.artsci1)                         AS ARTSCI1AVG,
                       COUNT(*)                               AS times_taught
                FROM ${tablePrefix}courses c
                         JOIN ${tablePrefix}offerings o ON c.course_id = o.course_id
                         JOIN ${tablePrefix}evaluations e ON o.offering_id = e.offering_id
                         NATURAL JOIN ${tablePrefix}professors p
                WHERE CONCAT(LOWER(p.first_name), ' ', LOWER(p.last_name)) LIKE LOWER($1)
                GROUP BY p.prof_id, c.course_id, c.code, p.first_name, p.last_name
                ORDER BY COUNT(*) DESC;`,
            [`%${prof_name}%`]
        );
        res.json(result.rows);
    } catch (err) {
        throw new AppError("Failed in getProfByCode")
    }
}
