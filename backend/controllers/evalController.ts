import db from '../db';
import {Request, Response} from 'express';

export const getEvaluations = async (req: Request, res: Response): Promise<void> => {
    /**
     *  Pre-Cond:
     *      Req needs to have two params: course_id and prof_id
     */
    const { course_id, prof_id } = req.query;
    try {
        const sql =
            `
            SELECT *
            FROM courses c
             JOIN offerings o ON c.course_id = o.course_id
             JOIN evaluations e ON o.offering_id = e.offering_id
             NATURAL JOIN professors p
                WHERE c.course_id = $1
                  and p.prof_id = $2;
            `;
        const result = await db.query(sql, [course_id, prof_id]);
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
