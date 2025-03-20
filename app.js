import express from 'express';
import bodyParser from 'body-parser';
import urlRouter from './routes/url.route.js';
import userRouter from './routes/user.route.js';
import path from 'path';
// import URL from './models/url.model.js';
import viewsRouter from './routes/views.route.js';
import authRouter from './routes/auth.route.js';

const app = express();

// view engine
app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));

// middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//route for testing home page ejs
// app.get('/test', async (req, res)=>{
//     const allUrls = await URL.find({});
//     res.render('home', {
//         urls: allUrls,
//         name: 'Kunal Kaushik'
//     });
// })

//views route
app.use('/', viewsRouter);

//url and user routes
app.use('/api/urls', urlRouter);
app.use('/api/users', userRouter);

//auth route
app.use('/api/auth', authRouter); //for api endpoints (POST /register, POST /login, POST /logout)
app.use('/auth', authRouter); //for page rendering (GET /login, GET /register)

export {app};