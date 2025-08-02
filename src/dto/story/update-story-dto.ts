
import { IStory } from "../../interfaces/IStory";

export class UpdateStoryDto {
    title?: string;
    description?: string;
    audioUrl?: string;
    mission?: 'question' | 'picture';
    questions?: {
        questionText: string;
        choices: string[];
        correctAnswer: string;
    }[];

    toEntity(): Partial<IStory> {
       const partial: Partial<IStory> = {};
       if (this.title) partial.title = this.title;
       if (this.description) partial.description = this.description;
       if (this.audioUrl) partial.audioUrl = this.audioUrl;
       if (this.mission) partial.mission = this.mission;
       if (this.questions) partial.questions = this.questions;
       return partial;
    }
}
