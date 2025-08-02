import mongoose from "mongoose";

export interface IStory extends mongoose.Document {
    title: string;
    description: string;
    audioUrl?: string;
    content?: string;
    thumbnailUrl?: string;
    mission: 'question' | 'picture';
    questions?: {
        questionText: string;
        choices: string[];
        correctAnswer: string;
    }[];
    prompt?: string;
    useAI: boolean;
    genre: string;
    creator: mongoose.Types.ObjectId;
    likes: number;
    likedUser: mongoose.Types.ObjectId[];
}