import mongoose from "mongoose";
import { IStory } from "../interfaces/IStory";
const Schema = mongoose.Schema;

/**
 * @swagger
 * components:
 *   schemas:
 *     Story:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - audioUrl
 *         - content
 *         - mission
 *         - creator
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated ID of the story
 *         title:
 *           type: string
 *           description: The title of the story
 *           maxLength: 50
 *         description:
 *           type: string
 *           description: A brief description of the story
 *           maxLength: 500
 *         audioUrl:
 *           type: string
 *           description: URL of the story's audio file
 *           format: url
 *         content:
 *           type: string
 *           description: The full content of the story
 *         thumbnailUrl:
 *           type: string
 *           description: URL of the story's thumbnail image
 *           format: url
 *         mission:
 *           type: string
 *           enum: ['question', 'picture']
 *           description: The type of mission associated with the story
 *         questions:
 *           type: array
 *           description: Array of questions for 'question' type missions
 *           items:
 *             type: object
 *             properties:
 *               questionText:
 *                 type: string
 *               choices:
 *                 type: array
 *                 items:
 *                   type: string
 *               correctAnswer:
 *                 type: string
 *         creator:
 *           type: string
 *           description: The ID of the user who created the story
 *         likes:
 *           type: number
 *           description: The number of likes the story has received
 *           default: 0
 *         likedUser:
 *           type: array
 *           description: Array of user IDs who liked the story
 *           items:
 *             type: string
 *         rating:
 *           type: number
 *           description: The average rating of the story
 *           default: 0
 *         experienceCount:
 *           type: number
 *           description: The number of times the story has been experienced
 *           default: 0
 *         level:
 *           type: number
 *           description: The level of the story
 *           default: 0
 *         comments:
 *           type: array
 *           description: Array of comments on the story
 *           items:
 *             type: object
 *             properties:
 *               user:
 *                 type: string
 *                 description: The ID of the user who made the comment
 *               text:
 *                 type: string
 *                 description: The comment text
 *               createdAt:
 *                 type: string
 *                 format: date-time
 *                 description: The date and time when the comment was created
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the story was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the story was last updated
 *     CreateStoryDto:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - mission
 *         - genre
 *         - useAI
 *       properties:
 *         title:
 *           type: string
 *           description: The title of the story
 *           maxLength: 50
 *         description:
 *           type: string
 *           description: A brief description of the story
 *           maxLength: 500
 *         content:
 *           type: string
 *           description: The full content of the story
 *         mission:
 *           type: string
 *           enum: ['question', 'picture']
 *           description: The type of mission associated with the story
 *         questions:
 *           type: array
 *           description: Array of questions for 'question' type missions (required if mission is 'question')
 *           items:
 *             type: object
 *             required:
 *               - questionText
 *               - choices
 *               - correctAnswer
 *             properties:
 *               questionText:
 *                 type: string
 *               choices:
 *                 type: array
 *                 items:
 *                   type: string
 *               correctAnswer:
 *                 type: string
 *         genre:
 *           type: string
 *           description: The genre of the story
 *         prompt:
 *           type: string
 *           description: The prompt used for AI story generation
 *         useAI:
 *           type: boolean
 *           description: Indicates if AI is used for story generation
 *
 */
const storySchema = new Schema({
    title: {
        type: String,
        required: true,
        maxLength: 50
    },
    description: {
        type: String,
        required: true,
        maxLength: 500
    },
    audioUrl: {
        type: String,
        required: true,
        validate: {
            validator: function (v: string) {
                return /^https?:\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&:\/~+#-]*[\w@?^=%&\/~+#-])?$/.test(v);
            },
            message: (props: any) => `${props.value} is not a valid URL!`
        },
    },
    content: {
        type: String,
        required: true
    },
    genre: {
        type: [String],
        required: true
    },
    
    thumbnailUrl: {
        type: String,
        required: false,
        validate: {
            validator: function (v: string) {
                return /^https?:\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&:\/~+#-]*[\w@?^=%&\/~+#-])?$/.test(v);
            },
            message: (props: any) => `${props.value} is not a valid URL!`
        },
    },
    mission: {
        type: String,
        enum: ['question', 'picture'],
        required: true
    },
    questions: {
        type: [{
            questionText: {
                type: String,
                required: true
            },
            choices: {
                type: [String],
                required: true
            },
            correctAnswer: {
                type: String,
                required: true
            }
        }],
        required: function(this: any) { return this.mission === 'question'; },
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    likes: {
        type: Number,
        default: 0,
    },
    likedUser: [{
        type: Schema.Types.ObjectId,
        ref: 'users'
    }],
    rating: {
        type: Number,
        default: 0
    },
    experienceCount: {
        type: Number,
        default: 0
    },
    level: {
        type: Number,
        default: 0
    },
    comments: [{
        user: {
            type: Schema.Types.ObjectId,
            ref: 'users',
            required: true
        },
        text: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    timestamps: true
});

export default mongoose.model<IStory>("stories", storySchema);