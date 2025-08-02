import mongoose from "mongoose";

export interface IStory extends mongoose.Document {
    title: string;
    description: string;
    audioUrl: string;
    mission: 'question' | 'picture';
    questions?: {
        questionText: string;
        choices: string[];
        correctAnswer: string;
    }[];
    creator: mongoose.Types.ObjectId;
}