import { Request, Response } from 'express';
import db from '../db';
import {fetchEvaluations} from './evalController';

export async function getCourseByCode(course_name: string, tablePrefix: string){
    /*
        Called by getCourseEvalByCode. Gets a course_id based on name. If gets more than none or more than 1 result
        raise error. Returns course_id if success.
     */

    const result = await db.query(`
                SELECT c.course_id
                FROM ${tablePrefix}courses c
                WHERE LOWER(c.code) LIKE LOWER($1);
        `,
        [`%${course_name}%`]);
    if (result.rows.length > 1){
        throw new Error('Ambiguous: Input maps to multiple results')
    } else if (result.rows.length == 0){
        throw new Error('Unknown course code')
    }
    // so result is size 1
    return result.rows[0];
}
export const getCourseEvalByCode = async (req: Request, res: Response) => {
    /*
        Gets course eval by a string of course name. Calls getCoursebycode to retrieve course id then uses it to
        fetch evaluations. This is to be called by when category = course, view = evals
     */
    const {course_name, order_by, asc, demo} = req.query;
    const useDemo = req.query.demo === "true";  // e.g., /api/evaluations?demo=true
    const tablePrefix = useDemo ? "demo_" : "";

    try{
        const course_id_result = await getCourseByCode(String(course_name), tablePrefix);
        // call getEvaluations. It returns something like this:[ { course_id: 2490 } ]
        const eval_results = await fetchEvaluations({course_id: course_id_result.course_id, order_by: order_by, asc: asc, demo: String(demo)}); // error is caught inner function
        res.json(eval_results.rows);
    } catch (error) {
        res.status(500).send({error: (error as Error).message});
        return;
    }
}
export const getCourseAggregateByCode = async (req: Request, res: Response): Promise<void> => {
    /*
        Gets course aggregate groupby professor
     */
    debugger;
    const {course_name, demo} = req.query;
    const useDemo = demo === "true";
    const tablePrefix = useDemo ? "demo_" : "";
    try{
        const result = await db.query(
            `
                SELECT c.course_id, o.prof_id, CONCAT(p.first_name, ' ', p.last_name) AS prof_name, AVG(e.ins3) as INS3Avg,
                       AVG(e.ins6) AS INS6AVG, AVG(e.artsci1) AS ARTSCI1AVG, count(*) AS times_taught
                FROM ${tablePrefix}courses c JOIN ${tablePrefix}offerings o on c.course_id = o.course_id JOIN ${tablePrefix}evaluations e on o.offering_id = e.offering_id
                                             NATURAL JOIN ${tablePrefix}professors p WHERE LOWER(c.code) LIKE LOWER($1)
                GROUP BY c.course_id, o.prof_id, p.first_name, p.last_name ORDER BY count(*) DESC;
            `,
            [`%${course_name}%`]
        );
        if(result.rows.length == 0){
            res.status(400).json({error: 'Unknown course code'});
            return;
        }
        res.json(result.rows); // return as a json array
    }  catch (err) {
        if (err instanceof Error && 'code' in err) {
            const pgErr = err as any; // or define a better type if you want

            console.error('PostgreSQL error:', pgErr.message);
            console.error('Code:', pgErr.code); // e.g., '23505' for unique_violation

            res.status(500).json({ error: pgErr.message });
        }
        else {
            res.status(500).json({ error: 'Failed when calling getCourseAggregateByCode'});
        }
    }
}
