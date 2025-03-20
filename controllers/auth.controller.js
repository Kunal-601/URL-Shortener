import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

//register user
export const registerUser = async (req, res) => {
    try{
        const {name, email, password} = req.body;
        //check if any of the fields are empty
        if([name, email, password].some((field) => field?.trim() === ""))
        {
            return res
            .status(400)
            .json({
                success: false,
                message: "All fields are required"
            })
            
        }
        //check if the user already exists
        const existingUser = await User.findOne({email});
        if(existingUser)
        {
            return res
            .status(400)
            .json({
                success: false,
                message: "User already exists"
            })
            
        }
        //create new user
        const newUser = await User.create({
            name,
            email,
            password
        })
        return res
        .status(201)
        .json({
            success: true,
            message: "User registered successfully",
            user: newUser
        })
    }catch(error){
        res
        .status(500)
        .json({
            success: false,
            message: "User registration failed / " + error.message
        })
    }
}

//login user
export const loginUser = async (req, res) => {
    try{
        const {email, password} = req.body;
        if(!email || !password)
        {
            return res
            .status(400)
            .json({
                success: false,
                message: "All fields are required"
            })
            
        }
        const user = await User.findOne({email});
        if(!user)
        {
            // throw new Error("Invalid email or password/ User does not exist");
            return res
            .status(400)
            .json({
                success: false,
                message: "Invalid email or password/ User does not exist"
            })
            
        }
        const isPassCorrect = await user.isPasswordCorrect(password);
        if(!isPassCorrect)
        {
            return res
            .status(400)
            .json({
                error: "Invalid email or password"
            })
        }
        const token = jwt.sign(
            {
                id: user._id,
                email: user.email,
                name: user.name
            },
            process.env.JWT_SECRET,
            {expiresIn: "7d"}
        )
        res
        .status(200)
        .json({
            success: true,
            message: "User logged in successfully",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        })
        
    }
    catch(error)
    {
        res
        .status(500)
        .json({
            success: false,
            message: error.message
        })
    }
}

//logout user
export const logoutUser = async (req, res) => {
    try{
        res
        .status(200)
        .json({
            success: true,
            message: "User logged out successfully"
        })
    }
    catch(error){
        res
        .status(500)
        .json({
            success: false,
            message: error.message
        })
    }
}

