import { IStory } from "../../interfaces/IStory";

export class UpdateStoryDto {
    title?: string;
    description?: string;
    content?: string;
    mission?: 'question' | 'picture';
    questions?: {
        questionText: string;
        choices: string[];
        correctAnswer: string;
    }[];

    constructor(title?: string, description?: string, content?: string, mission?: 'question' | 'picture', questions?: { questionText: string; choices: string[]; correctAnswer: string; }[]) {
        this.title = title;
        this.description = description;
        this.content = content;
        this.mission = mission;
        this.questions = questions;
    }

    toEntity(): Partial<IStory> {
        const entity: Partial<IStory> = {};
        if (this.title) entity.title = this.title;
        if (this.description) entity.description = this.description;
        if (this.content) entity.content = this.content;
        if (this.mission) entity.mission = this.mission;
        if (this.questions) entity.questions = this.questions;
        return entity;
    }
}