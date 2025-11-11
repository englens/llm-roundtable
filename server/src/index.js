import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import conversationsRouter from './routes/conversations.js';
import configRouter from './routes/config.js';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/conversations', conversationsRouter);
app.use('/api/config', configRouter);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: 'Unexpected server error' });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
