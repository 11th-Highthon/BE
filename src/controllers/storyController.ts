
import { Request, Response } from 'express';
import * as storyService from '../services/storyService';
import * as userService from "../services/userService";
import { CreateStoryDto } from '../dto/story/create-story-dto';

export const createStory = async (req: Request, res: Response) => {
    try {
        const userEmail = req.user?.email;
        if (!userEmail) {
            return res.status(401).send({ error: 'User not authenticated' });
        }

        const { title, description, content, mission, genre, prompt, useAI } = req.body;
        const user = await userService.findByEmail(userEmail);
        const createStoryDto = new CreateStoryDto(title, description, mission, genre, useAI, content, prompt);
        const story = await storyService.createStory(createStoryDto, user?.id);
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
