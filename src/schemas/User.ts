import mongoose from "mongoose";
import { Schema } from "mongoose";

/**
 * @swagger
 * components:
 *   schemas:
 *     LoginUserDto:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: User's email for login
 *         password:
 *           type: string
 *           format: password
 *           description: User's password for login
 *     RegisterUserDto:
 *       type: object
 *       required:
 *         - username
 *         - password
 *         - email
 *       properties:
 *         username:
 *           type: string
 *           description: User's chosen username
 *         password:
 *           type: string
 *           format: password
 *           description: User's chosen password
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: User ID
 *           example: 652a8a2b5e1a2b3c4d5e6f7a
 *         username:
 *           type: string
 *           description: User's username
 *           example: testuser
 *         email:
 *           type: string
 *           description: User's email
 *           example: test@example.com
 *         createdStories:
 *           type: array
 *           items:
 *             type: string
 *             format: uuid
 *           description: Array of story IDs created by the user
 *         playedStories:
 *           type: array
 *           items:
 *             type: string
 *             format: uuid
 *           description: Array of story IDs played by the user
 *         likedStories:
 *           type: array
 *           items:
 *             type: string
 *             format: uuid
 *           description: Array of story IDs liked by the user
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: User creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Last update timestamp
 */
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