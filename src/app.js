import express from 'express';
import router from './routes/index.js';
import LogMiddleware from './middlewares/log.middleware.js';
import ErrorHandlingMiddleware from './middlewares/error-handling.middleware.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.DATABASE_PORT

app.use(LogMiddleware);
app.use(express.json());
app.use('/api', router);
app.use(ErrorHandlingMiddleware);

app.listen(port, () => {
    console.log(port, '포트로 서버가 열렸어요!');
});