const express=require('express');
const cookieParser = require('cookie-parser');
require('dotenv').config();
import cors from 'cors';


const authRoutes=require('./routes/authRoutes');
const messageRoutes=require('./routes/messageRoutes');


const app=express();
app.use(express.json());
app.use(cookieParser());
app.use({
  origin:['http://localhost:3000/'],
  credentials:true,
});
app.set('view engine', 'ejs');


require('./DB/connection');


app.use('/api/auth',authRoutes);
app.use('/api/message',messageRoutes);


const port=process.env.PORT||3001;


app.listen(port,()=>{
  console.log(`Server listening on: ${port}`)
});