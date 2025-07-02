import db from '../db';
import {Request, Response} from 'express';

export const fetchEvaluations = async (filters: { course_id?: any, prof_id?: any; year?: any; order_by?: any; asc?: any; })=> {
    /**
     *  Pre-Cond:
     *      If order by is defined order must be either "ASC" or "DESC"
     *  All params can be empty
     *  Now: Can pass variable inputs into request. Code now checks for existence, and passes them into sql query
     *  if they do exist.
     *  eg: await fetch(`/api/evals?course_id=${course_id}&prof_id=${prof_id}&year=${...}`);
     */
        // asc: if = asc then sort by ascending order.

    const {course_id, prof_id, year, order_by, asc} = filters;
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

    /*
        To handle variable args we do string concat. append non empty args into array and then join them.
     */
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

    return await db.query(sql, values);

}
export const getEvaluations = async (req: Request, res: Response) => {
    /*
    Separate function just to handle http req
     */
    try{
        const result = await fetchEvaluations(req.query as any)
        res.json(result.rows)
    } catch(err){
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
}