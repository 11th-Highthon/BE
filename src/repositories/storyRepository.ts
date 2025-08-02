import mongoose from "mongoose";
import Story from "../schemas/Story";
import { IStory } from "../interfaces/IStory";


export const createStory = async (storyData: Partial<IStory>) : Promise<IStory> => {
    const newStory = new Story(storyData);
    return await newStory.save();
};

export const findStoryById = async (id: mongoose.Types.ObjectId) : Promise<IStory | null> => {
    return await Story.findById(id).exec();
};

export const findAllStories = async () : Promise<IStory[]> => {
    return await Story.find().exec();
};

export const getPopularStories = async (page: number, limit: number) : Promise<IStory[]> => {
    return await Story.find()
        .sort({ likes: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .exec();
}

export const getNewStories = async (page: number, limit: number) : Promise<IStory[]> => {
    return await Story.find()
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .exec();
}