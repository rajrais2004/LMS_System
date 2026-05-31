import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';
import { connectDatabase } from './config/db';
import routes from './routes';
import { ApiError } from './utils/errors';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const app = express();
const PORT = Number(process.env.PORT ?? 4000);
const apiOrigin = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

app.use(cors({ origin: apiOrigin, credentials: true }) as express.RequestHandler);
app.use(cookieParser() as express.RequestHandler);
app.use(express.json() as express.RequestHandler);
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')) as express.RequestHandler);
app.use('/api', routes as any);

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  const status = err.status || 500;
  res.status(status).json({ error: err.message ?? 'Internal server error' });
});

connectDatabase(process.env.MONGO_URI ?? 'mongodb://localhost:27017/lms')
  .then(() => {
    app.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`API server ready at http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error('Database connection failed', error);
    process.exit(1);
  });
