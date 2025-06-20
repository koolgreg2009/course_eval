import express from 'express';
import {
    getProfByCode
} from '../controllers/profController';

const router = express.Router();
debugger;
router.get('/search', getProfByCode);

export default router;