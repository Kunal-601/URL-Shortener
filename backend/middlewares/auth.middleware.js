import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const verifyJWT = async (req, res, next) => {
    try{
        const token = req.header("Authorization")?.replace("Bearer ", "")
        if(!token)
        {
            return res
            .status(401)
            .json({
                success: false,
                message: "No token provided / Unauthorized Request"
            })
        }
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const loggedInUser = await User.findById(decodedToken.id);
        if(!loggedInUser)
        {
            return res
            .status(401)
            .json({
                success: false,
                message: "Unauthorized Request"
            })
        }
        //VERY IMPORTANT STEP
        req.user = loggedInUser; //adding the user to the request object
        next();
    }catch(error){
        res
        .status(500)
        .json({
            success: false,
            message: error.message || "Invalid token"
        })
    }
}