import mongoose from "mongoose";
import Story from "../schemas/Story";
import { IStory } from "../interfaces/IStory";


export const createStory = async (storyData: IStory) : Promise<IStory> => {
    const newStory = new Story(storyData);
    return await newStory.save();
};

export const findStoryById = async (id: mongoose.Types.ObjectId) : Promise<IStory | null> => {
    return await Story.findById(id).exec();
};

export const findAllStories = async () : Promise<IStory[]> => {
    return await Story.find().exec();
};

export const updateStory = async (id: mongoose.Types.ObjectId, updates: Partial<IStory>): Promise<IStory | null> => {
    return await Story.findByIdAndUpdate(id, updates, { new: true }).exec();
};

export const deleteStory = async (id: mongoose.Types.ObjectId): Promise<IStory | null> => {
    return await Story.findByIdAndDelete(id).exec();
};
