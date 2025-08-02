import mongoose from "mongoose";
import { IStory } from "../interfaces/IStory";
import * as storyRepository from "../repositories/storyRepository";
import { CreateStoryDto } from "../dto/story";
import { generateContent } from "../utils/openai";

/**
 * @todo 평점 시스템 구현
 * @todo 후기 구현
 * @todo 체험 수 구현
 */

export const createStory = async (storyData: CreateStoryDto, userId : string): Promise<IStory> => {
    if(!storyData.title || !storyData.description  || !storyData.mission) {
        throw new Error("Missing required fields");
    }
    if(storyData.mission === 'question' && (!storyData.questions || storyData.questions.length === 0)) {
        throw new Error("Questions are required for 'question' mission type");
    }

    if (storyData.useAI && storyData.prompt) {
        storyData.content = await generateContent(storyData.prompt);
    }

    const story = storyData.toEntity();
    story.creator = new mongoose.Types.ObjectId(userId);

    // Generate Thumbnail with OpenAI API
    // await generateThumbnail();


    return await storyRepository.createStory(story);
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