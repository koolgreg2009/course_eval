import db from '../db';
import {Request, Response} from 'express';

export const getEvaluations = async (req: Request, res: Response): Promise<void> => {
    /**
     *  Pre-Cond:
     *      If order by is defined order must be either "ASC" or "DESC"
     *  Now: Can pass variable inputs into request. Code now checks for existence, and passes them into sql query
     *  if they do exist.
     *  eg: await fetch(`/api/evals?course_id=${course_id}&prof_id=${prof_id}&year=${...}`);
     */
    // const course_id = req.params.course_id;
    // const prof_id = req.params.prof_id;
        // asc: if = asc then sort by ascending order.
    const {course_id, prof_id, year, order_by, asc} = req.query;
    const values = [];
    const conditions = [];

    let sql =
            `
            SELECT *
            FROM courses c
             JOIN offerings o ON c.course_id = o.course_id
             JOIN evaluations e ON o.offering_id = e.offering_id
             NATURAL JOIN professors p
                WHERE 1=1 
            `;

    if (course_id) {
        values.push(course_id);
        conditions.push(`c.course_id = $${values.length}`)
    }
    if (prof_id) {
        values.push(prof_id);
        conditions.push(`prof_id = $${values.length}`)
    }
    if (year) {
        values.push(year);
        conditions.push(`year = $${values.length}`)
    }

    if (conditions.length > 0){
        const added_sql:string = `AND ${conditions.join(' AND ')}`
        sql += `${added_sql}`;
    }
    // If want to sort year by ascending order
    if (order_by){
        sql += `ORDER BY ${order_by} ${asc ? "ASC" : "DESC"};`
    } else{
        sql +=';';
    }
    try {
        const result = await db.query(sql, values);
        res.json(result);
    }catch(err){
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
