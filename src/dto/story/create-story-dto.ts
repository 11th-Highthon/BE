import { IStory } from "../../interfaces/IStory";

export class CreateStoryDto {
    title: string;
    description: string;
    content: string;
    mission: 'question' | 'picture';
    questions?: {
        questionText: string;
        choices: string[];
        correctAnswer: string;
    }[];
    
    constructor(title: string, description: string, content: string, mission: 'question' | 'picture', questions?: { questionText: string; choices: string[]; correctAnswer: string; }[]) {
        this.title = title;
        this.description = description;
        this.content = content;
        this.mission = mission;
        this.questions = questions; 
        if (this.mission === 'question' && (!this.questions || this.questions.length === 0)) {
            throw new Error("Questions are required for 'question' mission type");
        }
    }

    toEntity(): Partial<IStory> {
       return {
            title: this.title,
            description: this.description,
            content: this.content,
            mission: this.mission,
            questions: this.questions
        };
    }
}