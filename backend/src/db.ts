import { Pool, QueryResult, QueryResultRow } from 'pg';

const pool = new Pool();

export const query = <T extends QueryResultRow = any>(
    text: string,
    params?: any[]
): Promise<QueryResult<T>> => {
    return pool.query<T>(text, params);
};

export default pool;