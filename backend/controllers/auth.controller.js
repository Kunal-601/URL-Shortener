import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import {uploadOnCloudinary} from "../utils/cloudinary.js";

//register user
export const registerUser = async (req, res) => {
    try{
        const {username, email, password, status} = req.body;
        //check if any of the fields are empty
        if([username, email, password].some((field) => field?.trim() === ""))
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
                message: "User already exists / Email already in use"
            })
            
        }
        //upload avatar to cloudinary
        // console.log(req.file);
        let avatarUrl = "";
        if(req.file)
        {
            const cloudinaryResponse = await uploadOnCloudinary(req.file.path);
            // console.log(cloudinaryResponse);
            if(!cloudinaryResponse)
            {
                return res
                .status(500)
                .json({
                    success: false,
                    message: "Failed to upload avatar / Error in uploading to cloudinary"
                })
            }
            avatarUrl = cloudinaryResponse.url;
        }
        //create new user
        const newUser = await User.create({
            username,
            email,
            password,
            avatar: avatarUrl || "",
            status: status || "Hey there! I'm using ChatApp"
        })

        const token = jwt.sign(
            {
                id: newUser._id,
                email: newUser.email,
                username: newUser.username
            },
            process.env.JWT_SECRET,
            {expiresIn: "1d"}
        )
        
        return res
        .status(201)
        .json({
            success: true,
            message: "User registered successfully",
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                avatar: newUser.avatar,
                status: newUser.status
            },
            token
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
        //check if any of the fields are empty
        if([email, password].some((field) => field?.trim() === ""))
        {
            return res
            .status(400)
            .json({
                success: false,
                message: "All fields are required"
            })
        }

        //check if the user exists
        const user = await User.findOne({email});
        if(!user)
        {
            return res
            .status(400)
            .json({
                success: false,
                message: "User does not exist"
            })
        }

        const isPassCorrect = await user.isPasswordCorrect(password);
        if(!isPassCorrect)
        {
            return res
            .status(400)
            .json({
                success: false,
                message: "Invalid password"
            })
        }

        //generate JWT token
        const token = jwt.sign(
            {
                id: user._id,
                email: user.email,
                username: user.username
            },
            process.env.JWT_SECRET,
            {expiresIn: "1d"}
        )

        return res
        .status(200)
        .json({
            success: true,
            message: "User logged in successfully",
            token,
            user:{
                id: user._id,
                username: user.username,
                email: user.email,
                avatar: user.avatar,
                status: user.status
            }
        })
        
    }catch(error){
        res
        .status(500)
        .json({
            success: false,
            message: error.message || "Login failed"
        })
    }
}


//logout user
export const logoutUser = (req, res) => {
    try {
      res.cookie("jwt", "", { maxAge: 0 }); //deleting the cookie
      res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
      console.log("Error in logoutUser controller", error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
};

//update user
export const updateUser = async (req, res) => {
    try{
        const status = req.body.status;
        const userId = req.user._id; //comes from the verifyJWT middleware
        const picLocalPath = req.file?.path;
        const picCloudinaryUrl = "";
        if(picLocalPath)
        {
            const cloudinaryResponse = await uploadOnCloudinary(picLocalPath);   
            if(!cloudinaryResponse)
            {
                return res
                .status(500)
                .json({
                    success: false,
                    message: "Failed to upload avatar / Error in uploading to cloudinary"
                })
            }
            picCloudinaryUrl = cloudinaryResponse.url;
        }
        const updatedUser = await User.findByIdAndUpdate(userId,
            {
                status: status,
                avatar: picCloudinaryUrl || req.user.avatar
            },
            {new: true}
        )

        return res
        .status(200)
        .json({
            success: true,
            message: "User updated successfully",
            user: updatedUser
        })
    
    }catch(error){
        res
        .status(500)
        .json({
            success: false,
            message: error.message || "Update user failed"
        })
    }
}
