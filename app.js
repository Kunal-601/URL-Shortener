import express from 'express';
import bodyParser from 'body-parser';
import urlRouter from './routes/url.route.js';
import userRouter from './routes/user.route.js';
import path from 'path';


const app = express();

// view engine
app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));

// middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//route for testing home page ejs
app.get('/test', (req, res)=>{
    res.render('home');
})
//routes
app.use('/api/urls', urlRouter);
app.use('/api/users', userRouter);

export {app};