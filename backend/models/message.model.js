import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    text:{
        type: String,
    },
    image:{
        type: String,
    },
    sender:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    receiver:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    isRead: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true
})

messageSchema.pre("validate", function (next) {
    if (!this.text && !this.image) {
      next(new Error("Either text or image must be provided"));
    } else {
      next();
    }
  });

const Message = mongoose.model("Message", messageSchema)

export default Message

