import User from "../models/user.model.js";

export const getAllUsers = async(req, res) => {
    try{const allUsers = await User.find({});
        res.send(allUsers);
    } catch (error) {
        res
        .status(500)
        .json({ error: error.message });
    }
};

export const createUser = async(req, res) => {
    try{
        const body = req.body;
        const newUser = new User(body);
        await newUser.save();
        res
        .status(201)
        .send(newUser);
    }
    catch (error) {
        res
        .status(400)
        .json({ error: `Error occurred while creating a new user: ${error.message}` });    
    }
};