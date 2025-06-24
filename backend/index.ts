import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import courseRoutes from './routes/courseRoutes';
import professorRoutes from './routes/profRoutes';
import evalRoutes from "./routes/evalRoutes";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
debugger;
app.use('/api/courses', courseRoutes);
app.use('/api/professors', professorRoutes);
app.use('/api/evals', evalRoutes);
// Fallback (optional)
app.get('/', (_req, res) => {
    res.send('Welcome to the Course Evaluation API');
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
