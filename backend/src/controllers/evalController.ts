import db from '../db';
import {Request, Response} from 'express';
import {getProfByName} from './profController'
import {getCourseByCode} from './courseController'
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
    console.log(course_id, prof_id, year, order_by, asc);
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
        // console.log(prof_id)
        values.push(prof_id);
        conditions.push(`prof_id = $${values.length}`)
    }
    if (year) {
        values.push(year);
        conditions.push(`year = $${values.length}`)
    }
    // console.log(`conditions length is ${conditions.length}`)
    if (conditions.length > 0){
        const added_sql:string = `AND ${conditions.join(' AND ')}`
        sql += `${added_sql}`;
    }
    // If want to sort year by ascending order
    if (order_by){
        sql += ` ORDER BY ${order_by} ${asc ? "ASC" : "DESC"};`
    } else{
        sql +=';';
    }
    // console.log(sql);
    return await db.query(sql, values);

}
export const getEvaluations = async (req: Request, res: Response) => {
    /*
    Separate function just to handle http req
     */
    try{
        const result = await fetchEvaluations(req.query as any)
        // console.log(result.rows);
        res.json(result);
    } catch(err){
        // console.error(err);
        res.status(500).json({ error: 'Failed when calling getEvaluations' });
    }
}

export const getCourseAggregate = async (req: Request, res: Response) => {
    /*
    This function does a groupby of all evaluations and then returns the averaged ins and artsci values.
     */
    console.log("getCourseAggregate HIT");
    const {target, category} = req.query;
    let groupby: string = "";
    let value: string = "";
    const allowedGroupBys = ['course_id', 'prof_id']; // to prevent sql injection. if somenoe calls API/this route with 1=1 and "1=1; DROP TABLE evaluations; --"

    // problem is that rn we are passing in the name but we need the id so we actually need to call the respective getter functions
    if (category == "course") {
        groupby = "course_id";
        const result = await getCourseByCode(String(target));
        value = result.course_id;
    } else if (category == "professor") {
        groupby = "prof_id";
        const result = await getProfByName(String(target));
        value = result.prof_id;
    }

    if (!allowedGroupBys.includes(groupby)) {
        throw new Error('Invalid groupby');
    }

    const sql =
        `
        SELECT avg(ins1) AS ins1avg, avg(ins2) AS ins2avg, avg(ins3) AS ins3avg, avg(ins4) AS ins4avg, avg(ins5) AS ins5avg, 
               avg(ins6) AS ins6avg, avg(artsci1) AS artsci1avg, avg(artsci2) AS artsci2avg, avg(artsci3) AS artsci3avg
        FROM evaluations e join offerings o ON e.offering_id = o.offering_id
        WHERE o.${groupby} = $1
        GROUP BY o.${groupby};
        `;
    console.log(sql);

    try{
        const result = await db.query(sql, [value]);
        // console.log(result.rows);
        res.json(result);
    } catch(err){
        // console.error(err);
        res.status(500).json({ error: 'Failed when calling getCourseAggregate' });
    }
}

