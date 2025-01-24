import express from 'express';
import { loginUser, registerUser } from '../controllers/user.controller.js';



const userRouter=express.Router();

userRouter.post('/ragister',registerUser)

userRouter.post('/login',loginUser)

export default userRouter