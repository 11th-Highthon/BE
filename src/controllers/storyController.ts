
import { Request, Response } from 'express';
import * as storyService from '../services/storyService';
import { CreateStoryDto } from '../dto/story/create-story-dto';
import { UpdateStoryDto } from '../dto/story/update-story-dto';

export const createStory = async (req: Request, res: Response) => {
    try {
        const story = await storyService.createStory(req.body as CreateStoryDto);
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

export const updateStory = async (req: Request, res: Response) => {
    try {
        const story = await storyService.updateStory(req.params.id, req.body as UpdateStoryDto);
        if (!story) {
            return res.status(404).send({ error: 'Story not found' });
        }
        res.status(200).json(story);
    } catch (error: any) {
        res.status(400).send({ error: error.message });
    }
}

export const deleteStory = async (req: Request, res: Response) => {
    try {
        const story = await storyService.deleteStory(req.params.id);
        if (!story) {
            return res.status(404).send({ error: 'Story not found' });
        }
        res.status(200).json({ message: 'Story deleted successfully' });
    } catch (error: any) {
        res.status(400).send({ error: error.message });
    }
}
