import express from 'express';
import {
    getProfByCode
} from '../controllers/profController';

const router = express.Router();
debugger;
router.get('/code', getProfByCode);

export default router;