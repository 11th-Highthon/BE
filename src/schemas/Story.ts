import mongoose from "mongoose";
import { IStory } from "../interfaces/IStory";
const Schema = mongoose.Schema;

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
    }
}, {
    timestamps: true
});

export default mongoose.model<IStory>("stories", storySchema);