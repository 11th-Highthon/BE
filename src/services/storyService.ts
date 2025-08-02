import mongoose from "mongoose";
import { IStory } from "../interfaces/IStory";
import * as storyRepository from "../repositories/storyRepository";
import { CreateStoryDto } from "../dto/story";

export const createStory = async (storyData: CreateStoryDto): Promise<IStory> => {
    if(!storyData.title || !storyData.description  || !storyData.mission) {
        throw new Error("Missing required fields");
    }
    if(storyData.mission === 'question' && (!storyData.questions || storyData.questions.length === 0)) {
        throw new Error("Questions are required for 'question' mission type");
    }
    const story = storyData.toEntity();
    // TODO: get creator from user authentication
    story.creator = new mongoose.Types.ObjectId("60d5ec49e02f5a275c2d1b3e");
    return await storyRepository.createStory(story as IStory);
}

export const getStoryById = async (id: string): Promise<IStory | null> => {
    const storyId = new mongoose.Types.ObjectId(id);
    return await storyRepository.findStoryById(storyId);
}

export const getAllStories = async (): Promise<IStory[]> => {
    return await storyRepository.findAllStories();
}

export const getPopularStories = async (page: number, limit: number): Promise<IStory[]> => {
    return await storyRepository.getPopularStories(page, limit);
}

export const getNewStories = async (page: number, limit: number): Promise<IStory[]> => {
    return await storyRepository.getNewStories(page, limit);
}

