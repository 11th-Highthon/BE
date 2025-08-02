import mongoose from "mongoose";

export interface IStory extends mongoose.Document {
    title: string;
    description: string;
    audioUrl?: string;
    content?: string;
    thumbnailUrl?: string;
    mission: string[];
    prompt?: string;
    useAI: boolean;
    genre: string;
    creator: mongoose.Types.ObjectId;
    likes: number;
    likedUser: mongoose.Types.ObjectId[];
}