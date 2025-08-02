import { IStory } from "../../interfaces/IStory";

export class CreateStoryDto {
    title: string;
    description: string;
    content?: string;
    mission: 'question' | 'picture';
    questions?: {
        questionText: string;
        choices: string[];
        correctAnswer: string;
    }[];
    genre: string;
    prompt?: string;
    useAI: boolean;
    
    constructor(title: string, description: string, mission: 'question' | 'picture', genre: string, useAI: boolean, content?: string, questions?: { questionText: string; choices: string[]; correctAnswer: string; }[], prompt?: string) {
        if(!title || !description || !mission) {
            throw new Error("Missing required fields: title, description, mission");
        }
        this.title = title;
        this.description = description;
        this.content = content;
        this.mission = mission;
        this.questions = questions; 
        this.prompt = prompt;
        this.useAI = useAI;
        this.genre = genre;
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