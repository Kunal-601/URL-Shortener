import mongoose from "mongoose";

const urlSchema = new mongoose.Schema({
    originalUrl: {
        type: String,
        required: true,
    },
    shortURL: {
        type: String,
        required: true,
        unique: true,
    },
    clicks: {
        type: Number,
        required: true,
        default: 0,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }

    
},{
    timestamps: true
})

urlSchema.methods.incrementClicks = async function() {
    this.clicks += 1;
    await this.save()
}

const URL = mongoose.model("URL", urlSchema);

export default URL;