import { Request, Response } from 'express';
import db from '../db';
import {fetchEvaluations, getEvaluations} from "./evalController";
import {getCourseEvalByCode} from "./courseController";

async function getProfByName(prof_name: string){
    /*
       Retrieves prof_id (s) based on input string. Check for >1 in function.
     */
    const result = await db.query(`
                SELECT p.prof_id
                FROM professors p
                WHERE LOWER(CONCAT(p.first_name, ' ', p.last_name)) LIKE LOWER($1);
        `,
        [`%${prof_name}%`]);
    return result.rows;

}

export const getCourseEvalByProfName = async (req: Request, res: Response) => {
    const {prof_name, order_by, asc} = req.query;
    const prof_id_result = await getProfByName(String(prof_name));
    if (prof_id_result.length > 1){
        res.status(400).json({error: 'Ambiguous: Input maps to multiple results'});
        return;
    } else if(prof_id_result.length === 0){
        res.status(400).json({error: 'Unknown Professor'});
        return;
    }else{
        const eval_result = await fetchEvaluations({prof_id: prof_id_result[0].prof_id, order_by: order_by, asc: asc});
        res.json(eval_result.rows);
    }
}
export const getProfByCode = async (req: Request, res: Response) => {
    /**
     * Searches for a prof by name. Returns some aggregational statistics of them
     */
    debugger;
    console.log('✅ Backend hit in prof! query =', req.query.prof_name);
    const {prof_name} = req.query;
    const prof_id_result = await getProfByName(String(prof_name));
    if (prof_id_result.length > 1){
        res.status(400).json({error: 'Ambiguous: Input maps to multiple results'});
        return;
    } else if(prof_id_result.length === 0){
        res.status(400).json({error: 'Unknown professor'});
        return;
    }
    else {
        try {
            const result = await db.query(
                `
                    SELECT p.prof_id,
                           c.course_id,
                           CONCAT(p.first_name, ' ', p.last_name) AS "name",
                           c.code                                 AS course,
                           AVG(e.ins3)                            AS INS3Avg,
                           AVG(e.ins6)                            AS INS6AVG,
                           AVG(e.artsci3)                         AS ARTSCI3AVG,
                           COUNT(*)                               AS times_taught
                    FROM courses c
                             JOIN offerings o ON c.course_id = o.course_id
                             JOIN evaluations e ON o.offering_id = e.offering_id
                             NATURAL JOIN professors p
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
                res.status(500).json({error: 'Internal server error'});
            }
        }
    }
}
