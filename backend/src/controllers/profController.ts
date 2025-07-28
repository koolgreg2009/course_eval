import { Request, Response } from 'express';
import db from '../db';
import {fetchEvaluations,} from "./evalController";

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
    if (result.rows.length > 1){
        throw new Error('Ambiguous: Input maps to multiple results');
    } else if(result.rows.length === 0) {
        throw new Error('Unknown professor');
    }
    return result.rows[0];

}

export const getCourseEvalByProfName = async (req: Request, res: Response) => {
    const {prof_name, order_by, asc, demo} = req.query;
    const tablePrefix: string = demo === "true" ? "demo_" : ""

    const prof_id_result = await getProfByName(String(prof_name), tablePrefix);

    try{
        const eval_result = await fetchEvaluations({prof_id: prof_id_result.prof_id, order_by: order_by, asc: asc, demo: String(demo)});
        res.json(eval_result.rows);
    } catch(error){
        console.log("getCourseEval failed")
        res.status(500).send({error: (error as Error).message});
        return;
    }

}
export const getProfByCode = async (req: Request, res: Response) => {
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
        if (err instanceof Error && 'code' in err) {
            const pgErr = err as any; // or define a better type if you want

            console.error('PostgreSQL error:', pgErr.message);
            console.error('Code:', pgErr.code); // e.g., '23505' for unique_violation

            res.status(500).json({error: pgErr.message});
        } else {
            console.error('Unknown error:', err);
            res.status(500).json({error: 'Failed when calling getProfByCode'});
        }
    }
    //}
}
