
import cloudinary from "../config/cloudinary.config.js";
import UserModel from '../model/user.model.js'
import fs from 'fs'
import bcrypt from 'bcrypt'

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
            password: req.body.password,
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

export const loginUser = () => { };

