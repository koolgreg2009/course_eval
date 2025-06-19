import { Request, Response } from 'express';
import db from '../db';

export const getCourseAggregateByCode = async (req: Request, res: Response): Promise<void> => {
    console.log('✅ Backend hit! query =', req.query.q);
    debugger;
    const {q} = req.query;
    if (!q || typeof q !== 'string'){
        res.status(400).json({error: 'invalid query parameter `q`'});
        return;
    }
    try{
        const result = await db.query(
            `
                SELECT o.prof_id, p.first_name, p.last_name, AVG(e.ins3) as INS3Avg, 
                    AVG(e.ins6) AS INS6AVG, AVG(e.artsci3) AS ARTSCI3AVG, count(*) AS total_times_taught 
                FROM courses c JOIN offerings o on c.course_id = o.course_id JOIN evaluations e on o.offering_id = e.offering_id 
                    NATURAL JOIN professors p WHERE LOWER(c.code) LIKE LOWER($1) 
                GROUP BY o.prof_id, p.first_name, p.last_name ORDER BY count(*) DESC;
            `,
            [`%${q}%`]
        );
        res.json(result.rows); // return as a json array
    }  catch (err) {
    if (err instanceof Error && 'code' in err) {
        const pgErr = err as any; // or define a better type if you want

        console.error('PostgreSQL error:', pgErr.message);
        console.error('Code:', pgErr.code); // e.g., '23505' for unique_violation

        res.status(500).json({ error: pgErr.message });
    } else {
        console.error('Unknown error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}


}

export const getCourseEvalByCode = async (req: Request, res: Response) => {
    /**
     * Searches for a course by code, returning rows with the matching course.
     * This express handler doesn't return, just sends a response in the res object
     */
    const {q} = req.query;

    if (!q || typeof q !== 'string'){
        return res.status(400).json({error: 'invalid query parameter `q`'});
    }
    try{
        const result = await db.query(
            `
            
            `
        );

    } catch (err){
        console.error('DB error:', err);
    }
}

export const searchCourses = async (req: Request, res: Response) => {

}
