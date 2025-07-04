import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import courseRoutes from './routes/courseRoutes';
import professorRoutes from './routes/profRoutes';
import evalRoutes from "./routes/evalRoutes";
import path from 'path';
import { fileURLToPath } from 'url'; // __dirname isnt defined by default since using ES module

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

app.use(express.static(path.join(__dirname, '../../frontend/dist'))); // serves all static assets (JS, CSS, images)

app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/dist', 'index.html')); // app.get('*') catch-all returns index.html for React Router
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});


