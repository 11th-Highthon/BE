
import { Request, Response } from 'express';
import * as storyService from '../services/storyService';
import { CreateStoryDto } from '../dto/story/create-story-dto';

export const createStory = async (req: Request, res: Response) => {
    try {
        const userId : string = req.user?.id;
        if (!userId) {
            return res.status(401).send({ error: 'User not authenticated' });
        }

        const { title, description, content, mission, questions } = req.body;
        const createStoryDto = new CreateStoryDto(title, description, content, mission, questions);
        const story = await storyService.createStory(createStoryDto, userId);
        res.status(201).json(story);
    } catch (error: any) {
        res.status(400).send({ error: error.message });
    }
}

export const getStoryById = async (req: Request, res: Response) => {
    try {
        const story = await storyService.getStoryById(req.params.id);
        if (!story) {
            return res.status(404).send({ error: 'Story not found' });
        }
        res.status(200).json(story);
    } catch (error: any) {
        res.status(400).send({ error: error.message });
    }
}

export const getAllStories = async (req: Request, res: Response) => {
    try {
        const stories = await storyService.getAllStories();
        res.status(200).json(stories);
    } catch (error: any) {
        res.status(400).send({ error: error.message });
    }
}

export const getPopularStories = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const stories = await storyService.getPopularStories(page, limit);
        res.status(200).json(stories);
    } catch (error: any) {
        res.status(400).send({ error: error.message });
    }
}

export const getNewStories = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const stories = await storyService.getNewStories(page, limit);
        res.status(200).json(stories);
    } catch (error: any) {
        res.status(400).send({ error: error.message });
    }
}
