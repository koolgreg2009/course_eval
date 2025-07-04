import express from 'express';
import {
    getCourseEvalByProfName,
    getProfByCode
} from '../controllers/profController';

const router = express.Router();
debugger;
router.get('/aggregate', getProfByCode);
router.get('/evals', getCourseEvalByProfName)
export default router;