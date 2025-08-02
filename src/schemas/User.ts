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
        validate: {
            validator: function (v: string) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            },
            message: (props: any) => `${props.value} is not a valid email address!`
        }
    },
    createdStories: [{
        type: Schema.Types.ObjectId,
        ref: 'stories'
    }],
    playedStories: [{
        type: Schema.Types.ObjectId,
        ref: 'stories'
    }],
    likedStories: [{
        type: Schema.Types.ObjectId,
        ref: 'stories'
    }],
    followers: [{
        type: Schema.Types.ObjectId,
        ref: 'users'
    }],
    following: [{
        type: Schema.Types.ObjectId,
        ref: 'users'
    }]
}, {
    timestamps: true
});



export default mongoose.model('users', userSchema);