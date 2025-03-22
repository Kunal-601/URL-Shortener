import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import {getReceiverSocketId, io} from "../utils/socket.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

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

//get messages
export const getMessages = async(req, res) => {
    const {id : receiverId} = req.params; // Extract the chat partner's ID from URL params
    const myId = req.user._id; // this we get from the verifyJWT middleware

    //fetch the msgs btw the two users
    try{
        const messages = await Message.find({
            $or: [
                {sender: myId, receiver: receiverId},
                {sender: receiverId, receiver: myId}
            ]
        }).sort({createdAt: -1})  // Sort messages by timestamp
        .exec();

        // Mark unread messages as read if they are sent to the current user
        const unreadMsgs = messages.filter((msg) => !msg.isRead && msg.receiver.toString() === myId.toString());
        await Promise.all(unreadMsgs.map((msg) => Message.findByIdAndUpdate(msg._id, {
            isRead: true
        })))

        res.status(200).json({
            success: true,
            message: "Messages fetched successfully",
            data: messages,
        });

    }catch(error)
    {
        res
        .status(500)
        .json({
            success: false,
            message: error.message || "Error in fetching messages"
        })
    }
    

}


//send message
export const sendMessage = async(req, res) => {
    try{
        const {text} = req.body;
        const {id : receiverId} = req.params;
        const senderId = req.user.id; //from the verifyJWT middleware
        
        // console.log(`receiverId : ${receiverId}`);
        // console.log(`senderId : ${senderId}`);
        
        
        const receiver = await User.findById(receiverId);
        if(!receiver)
            {
                // console.log("Receiver not found");
                return res.status(404)
                .json({
                    success: false,
                    message: "Receiver not found"
                })
            }
            
        // const imageLocalPath = req.file?.path;
        let imageUrl = "";
        if(req.file)
        {
            const cloudinaryResponse = await uploadOnCloudinary(req.file.path);
            if(!cloudinaryResponse)
            {
                return res
                .status(500)
                .json({
                    success: false,
                    message: "Failed to upload image / error in sendMessage controller"
                })
            }
            imageUrl = cloudinaryResponse.url;
        }
        //validate msg content
        if(!text && !imageUrl)
        {
            // console.log("Either text or image must be provided");
            return res.status(400)
            .json({
                success: false,
                message: "Either text or image must be provided"
            })
        }

        //create a new message
        const newMsg = new Message({
            text: text || "",
            image: imageUrl || "",
            sender: senderId,
            receiver: receiverId
        })

        const savedMsg = await newMsg.save(); //save the message to the db

        const receiverSocketId = getReceiverSocketId(receiverId);
        if(receiverSocketId)
        {
            io.to(receiverSocketId).emit("newMessage", savedMsg);
        }

        res.status(201)
        .json({
            success: true,
            message: "Message sent successfully",
            data: savedMsg
        })
        
    }catch (error) {
        console.error("Error in sendMessage controller:", error.message);
        res.status(500).json({
          success: false,
          message: "Internal server error",
        });
    }
}

