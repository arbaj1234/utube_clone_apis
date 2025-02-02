
import cloudinary from "../config/cloudinary.config.js";
import UserModel from '../model/user.model.js'
import fs from 'fs'
import bcrypt from 'bcrypt'
import { generateToken } from "../helper/generateToken.js";
// generateToken

export const registerUser = async (req, res, next) => {
    try {
        // checking if the user already exists
        const existingUser = await UserModel.findOne({ email: req.body.email })
        if (existingUser) {
            return res.status(404).json({ message: 'user already exists' })
        }

        // // uplode the image
        const result = await cloudinary.uploader.upload(req.files.logo.tempFilePath)
        const logo = {
            public_id: result.public_id,
            url: result.secure_url
        }

        const hashPassword = await bcrypt.hash(req.body.password, 10)
        const newUser = new UserModel({
            channelName: req.body.channelName,
            userName: req.body.userName,
            phone: req.body.phone,
            email: req.body.email,
            password:hashPassword ,
            logo: logo
        })
        await newUser.save();
        res.status(200).json({
            message: "User signup successful",
            user: newUser
        })
    } catch (error) {
        next(error)
    }


};

export const loginUser = async (req, res, next) => {

    try {
        // checking if the user is there
        const user = await UserModel.findOne({ email: req.body.email })
        console.log('object' , user);
        if (!user) {
            return res.status(400).json({ message: 'User not found' })
        }


        // verify the password
        const isMatch = await bcrypt.compare(req.body.password, user.password)
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid Credentials" })
        }
        user.password = undefined

        // token
        const token = generateToken(user)
        res.cookie("token", token).status(200).json({
            messsage: `Welcome ${user.userName}`,
            token,
            user,
        })


    } catch (error) {

        next(error);
    }

};

