import express from "express";
import {getEvaluations} from "../controllers/evalController";

const router = express.Router();


router.get("/", getEvaluations);

export default router;