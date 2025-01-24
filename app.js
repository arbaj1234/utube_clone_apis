import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import connectDB from './config/db.config.js';
import cors from 'cors'
import morgan from 'morgan';
import fileUpload from 'express-fileupload'
import cookieParser from 'cookie-parser';
import userRouter from './routes/user.route.js';

const app = express();

// express middlewares
app.use(cors());
app.use(morgan('dev'))
app.use(fileUpload({
    useTempFiles: true,
}))

app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 5050;
connectDB();

// app.use('*',(req,res)=>{
//     res.status(404).json({
//         massage:'bad request'
//     })
// })

app.use('/user',userRouter);


app.listen(PORT, () => {
    console.log(`server runnimg on PORT ${PORT}`);
});