import express from 'express'
import cookieParser from 'cookie-parser'

import {dbconnect} from './database/db.js'
import authRoutes from './routes/auth.routes.js'

const app = express();
const PORT = process.env.PORT  || 3500;

app.use(express.json());  //parse the incoming request: req.body
app.use(cookieParser()); //parse tje incoming cookies from req.cookie

// db connection
dbconnect();

app.get('/',(req,res)=>{
    res.send("hello")
})

app.use('/api/auth',authRoutes)

app.listen(PORT, ()=>{
    console.log('server is running on port 3500');
})


// mongodb password : OGtHfCAqzMheYs7k
