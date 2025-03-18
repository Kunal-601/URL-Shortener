import express from 'express';
import bodyParser from 'body-parser';
import urlRouter from './routes/url.route.js';
import userRouter from './routes/user.route.js';


const app = express();

// middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//routes
app.use('/api/urls', urlRouter);
app.use('/api/users', userRouter);

export {app};