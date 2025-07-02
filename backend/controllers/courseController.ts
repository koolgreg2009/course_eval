import { Request, Response } from 'express';
import db from '../db';
import {fetchEvaluations} from '../controllers/evalController';

async function getCourseByCode(course_name: string){
    const result = await db.query(`
                SELECT c.course_id
                FROM courses c
                WHERE LOWER(c.code) LIKE LOWER($1);
        `,
        [`%${course_name}%`]);
    return result.rows;

}
export const getCourseEvalByCode = async (req: Request, res: Response) => {
    /*
        Gets course eval by a string of course name. Calls getCoursebycode to retrieve course id then uses it to
        fetch evaluations. This is to be called by when category = course, view = evals
     */
    const {course_name} = req.query;
    const course_id_result = await getCourseByCode(String(course_name));
    if (course_id_result.length > 1){
        res.status(400).json({error: 'Ambiguous: Input maps to multiple results'})
        return;
    } else if(course_id_result.length === 0){
        res.status(400).json({error: 'Unknown course code'});
        return;
    }
    else{
        // call getEvaluations. It returns something like this:[ { course_id: 2490 } ]
        const eval_results = await fetchEvaluations({course_id: course_id_result[0].course_id}); // error is caught inner function
        res.json(eval_results.rows);
    }
}
export const getCourseAggregateByCode = async (req: Request, res: Response): Promise<void> => {
    console.log('✅ Backend hit! query =', req.query.course_name);
    debugger;
    const {course_name} = req.query;
    try{
        const result = await db.query(
            `
                SELECT c.course_id, o.prof_id, CONCAT(p.first_name, ' ', p.last_name) AS prof_name, AVG(e.ins3) as INS3Avg, 
                    AVG(e.ins6) AS INS6AVG, AVG(e.artsci3) AS ARTSCI3AVG, count(*) AS times_taught 
                FROM courses c JOIN offerings o on c.course_id = o.course_id JOIN evaluations e on o.offering_id = e.offering_id 
                    NATURAL JOIN professors p WHERE LOWER(c.code) LIKE LOWER($1) 
                GROUP BY c.course_id, o.prof_id, p.first_name, p.last_name ORDER BY count(*) DESC;
            `,
            [`%${course_name}%`]
        );
        res.json(result.rows); // return as a json array
    }  catch (err) {
    if (err instanceof Error && 'code' in err) {
        const pgErr = err as any; // or define a better type if you want

        console.error('PostgreSQL error:', pgErr.message);
        console.error('Code:', pgErr.code); // e.g., '23505' for unique_violation

        res.status(500).json({ error: pgErr.message });
    }
    else {
        console.error('Unknown error:', err);
        res.status(500).json({ error: 'Internal server error' });
        }
    }


}

