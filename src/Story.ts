import story from "./story.json";

export interface Story {
    readonly start: string;
    readonly chapters: { [name: string]: Chapter };
}

export interface Chapter {
    readonly name: string;
    readonly entryConditions?: string[];
    readonly fast?: boolean;
    readonly body: string[];
    readonly solutions: Solution[];
}

export interface Solution {
    readonly answer: string[];
    readonly next: string;
}

export function loadStory(): Story {
    return story;
}