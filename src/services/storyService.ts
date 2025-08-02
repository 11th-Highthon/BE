import mongoose from "mongoose";
import { IStory } from "../interfaces/IStory";
import * as storyRepository from "../repositories/storyRepository";
import { CreateStoryDto } from "../dto/story";
import { generateContent, generateStoryImage } from "../utils/openai";
import { filterImagePrompt } from "../utils/openai";
import { v4 as uuidv4 } from 'uuid';
import supabase from "../utils/supabase";

/**
 * @todo 평점 시스템 구현
 * @todo 후기 구현
 * @todo 체험 수 구현
 */

export const createStory = async (storyData: CreateStoryDto, userId: string): Promise<IStory> => {
    if (!storyData.title || !storyData.description || !storyData.mission) {
        throw new Error("Missing required fields");
    }

    if (storyData.useAI && storyData.prompt) {
        storyData.content = await generateContent(storyData.prompt, storyData.genre);
    }

    const story = storyData.toEntity();
    story.creator = new mongoose.Types.ObjectId(userId);

    // Generate Thumbnail with OpenAI API (Safe Prompt)
    const safePrompt = filterImagePrompt(story.content!);
    story.thumbnailUrl = await generateStoryImage(safePrompt);

    const voiceId = "db26b7e1720e0812dd8979";
    const ttsApiUrl = `https://supertoneapi.com/v1/text-to-speech/${voiceId}`;
    const fetchModule = await import("node-fetch");
    const fetch = fetchModule.default;

    let audioBuffers: Buffer[] = [];
    const chunkSize = 300;
    for (let i = 0; i < story.content!.length; i += chunkSize) {
        const chunk = story.content!.substring(i, i + chunkSize);
        const ttsData = {
            text: chunk,
            language: 'ko',
            style: "serene",
            model: "sona_speech_1"
        };
        const options = {
            method: 'POST',
            headers: {
                'x-sup-api-key': process.env.SUPERTONE_API_KEY ?? "",
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(ttsData)
        }
        const ttsResponse = await fetch(ttsApiUrl, options);
        const arrayBuffer = await ttsResponse.arrayBuffer();
        audioBuffers.push(Buffer.from(arrayBuffer));
    }

    const buffer = Buffer.concat(audioBuffers);

    const fileName = `${uuidv4()}.wav`;
    const { data, error } = await supabase.storage
        .from('audio-files')
        .upload(`tts/${fileName}`, buffer, {
            contentType: 'audio/wav',
            upsert: true,
        });
    if (error) {
        console.error('Supabase 업로드 실패:', error.message);
        throw new Error("Supabase 업로드 실패");
    }
    const { data: publicUrlData } = supabase
        .storage
        .from('audio-files')
        .getPublicUrl(`tts/${fileName}`);
    story.audioUrl = publicUrlData.publicUrl;

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