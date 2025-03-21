import User from "../models/user.model.js";
import Message from "../models/message.model.js";

//get the list of users except the current user
//this will help us to populate the users in the sidebar
export const getUsers = async (req, res) => {
    try{
        const loggedInUserId = req.user._id; //comes from the verifyJWT middleware
        const otherUsers = await User.find({_id: {$ne: loggedInUserId}}).select("-password");

        res
        .status(200)
        .json({
            success: true,
            message: "Users fetched successfully",
            users: otherUsers
        })
    }catch(error){
        res
        .status(500)
        .json({
            success: false,
            message: error.message || "Error in fetching users"
        })
    }
}


