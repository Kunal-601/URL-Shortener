import dotenv from 'dotenv';
import connectDB from './db/index.js';
import {app} from './app.js';
// require('dotenv').config({path: './env'})
dotenv.config({
    path: './.env'
});
const PORT = process.env.PORT || 8000;
connectDB()
.then(()=>{
    app.listen(PORT || 8000, ()=>{
        console.log(`Server is running on port ${PORT}`);
    })
})
.catch((err)=>{
    console.log("Mongodb connection failed !!!", err)
})
