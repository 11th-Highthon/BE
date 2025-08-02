import mongoose from "mongoose";
import { Schema } from "mongoose";

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    number:{
        type: String,
        required: true,
        unique: true,
    },
    createdStories: [{
        type: Schema.Types.ObjectId,
        ref: 'stories'
    }],
    playedStories: [{
        type: Schema.Types.ObjectId,
        ref: 'stories'
    }]
}, {
    timestamps: true
});

export default mongoose.model('User', userSchema);