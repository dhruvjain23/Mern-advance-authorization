import bcrypt from 'bcryptjs'
import crypto from 'crypto'

import { User } from "../models/user.model.js";
import { generateTokenAndSetCookie } from "../utils/gen_toke.js";
import { sendForgotPassEmail, sendResetSuccessfullEmail, sendVerificationEmail, sendWelcomeEmail } from "../mailtrap/email.js";


export const signup = async (req, res) => {
    //postman
    const { email, password, name } = req.body;
    try {
        if (!email || !password || !name) {
            throw new Error('All fields are required');
        }
        const userAlreadyExists = await User.findOne({ email });

        if (userAlreadyExists) { 
            return res.status(400).json({ success: false, message: 'User Already Exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

        const user = new User({
            name,
            email,
            password: hashedPassword,
            verificationToken,
            verificationTokenExpireAt: Date.now() + 24 * 60 * 60 * 1000 //24hours
        });
        await user.save();

        //jwt
        generateTokenAndSetCookie(res, user._id);

       
        await sendVerificationEmail(user.email,verificationToken);

        res.status(201).json({ success: true, message: 'User created Successfully',user:{
            ...user._doc,
            password:undefined,
        }
    })
    } catch (error) {
        console.log(error);
        res.status(400).json({ success: false, message: error.message });
    }
}

export const verifyEmail = async (req,res)=>{
    const {code,name} =req.body;

   
    try {

        if(!code || !name){
            throw new Error("All fiels required")
        }

        const user =await User.findOne({
            verificationToken:code,
            name:name,
            verificationTokenExpireAt: {$gt:Date.now()}
        })

        if (!user) {
           return res.status(404).json({success:false, message:"Invalid Verification Code and name"})
        }

        user.isVerified=true;
        user.verificationToken = undefined;
        user.verificationTokenExpireAt = undefined;
        await user.save();

        // send verification email
        await sendWelcomeEmail(user.email, user.name);
        res.status(200).json({success:true,message:"Welcome email sent successfully"})
    } catch (error) {
        console.log("Not Verifying the email",error)
        res.status(400).json({ success: false, message: error.message });
    }
}

export const login = async (req, res) => {

    const {email,password}=  req.body;
    try {
        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({success:false,message:'User did not exists with this email'})
        }
        console.log(email)
        console.log(password)
        console.log(user.password)
        const isPasswordValid = await bcrypt.compare(password,user.password);
        if (!isPasswordValid) {
            return res.status(400).json({success:false,message:'Invalid Password'})
        }
        const isVerified = user.isVerified;
        if (!isVerified) {
            console.log(user.email)
            console.log(user.verificationToken)
            sendVerificationEmail(user.email,user.verificationToken)
            return res.status(400).json({success:false,message:"Not Verified,Successfully sent the verification email, first verify your account "})
        }
        generateTokenAndSetCookie(res, user._id);
        user.lastLogin = new Date();
        await user.save();

        res.status(200).json({success:true,message:"Successfully Logged in", user:{
            ...user._doc,
            password:undefined
        }});
    } catch (error) {
        console.log("Error in login",error)
        return res.status(400).json({success:false,message:error.message})
    }
}

export const logout = async (req, res) => {
    res.clearCookie('token')
    res.status(200).json({success:true, message:"Logged out successfully"});
}

export const forgotPassword = async  (req,res)=>{
    const {email} = req.body
    try {
        const user  = await User.findOne({email})

        if (!user) {
            return res.status(400).json({success:false,message:'User did not exists with this email'})
        }
        // generate reset token
        const resetToken = crypto.randomBytes(20).toString('hex');
        const resetTokenExpiresAt = Date.now() + 1*60*60*1000; // 1 hour

        user.resetPasswordToken = resetToken;
        user.resetPaswwordExpiresAt = resetTokenExpiresAt;

        await user.save();

        // send password email
        await sendForgotPassEmail(user.email,`${process.env.CLIENT_URL}/reset-password/${resetToken}`);

        res.status(200).json({success:true,message:"Password reset link sent successfully"})
    } catch (error) {
        console.log("Error in sending the reset password link",error)
        res.status(400).json({success:false,message:error.message})
    }
}

export const resetPassword = async (req,res)=>{
    const {token}=req.params
    const {password}=req.body
    try {
        const user = await User.findOne({
            resetPasswordToken:token,
            resetPaswwordExpiresAt:{$gt:Date.now()}
        });
        if(!user){
            return res.status(400).json({success:false,message:'Some error occured !'})
        }
        const hashedPassword = await bcrypt.hash(password,10);
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPaswwordExpiresAt = undefined;

        await user.save();

        await sendResetSuccessfullEmail(user.email);

        res.status(200).json({success:true,message:"Password success reset email sent successfully"})
    } catch (error) {
        console.log("Error in sending the SRM", error)
        res.status(400).json({success:false,message:"Password success reset email not sent successfully"})
    }
}

export const checkAuth = async (req,res)=>{
    try {
        const user = await User.findById(req.userId).select("-password");
        if (!user) {
            return res.status(401).json({success:false,message:"User not found"})
        }
        res.status(200).json({success:true,user})

    } catch (error) {
        console.log("error in check auth",error)
        res.status(400).json({success:false,message:error.message})
    }
}