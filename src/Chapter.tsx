import * as React from "react";
import { Chapter as ChapterData } from "./Story";
import { Finishable } from "./text/Text";
import Phrase from "./text/Phrase";
import Keyword from "./text/Keyword";
import Paragraph from "./text/Paragraph";
import Prompt from "./containers/Prompt";

interface ChapterProps {
    readonly chapter: ChapterData;

    readonly onNavigate: (chapterName: string) => void;
}

const phrase = (text: string) => (props: Finishable) => (
    <Phrase text={text} onFinish={props.onFinish} />
);

const keyword = (text: string) => (props: Finishable) => (
    <Keyword text={text} location={"story"} onFinish={props.onFinish} />
);

const paragraph = (texts: Array<React.ComponentType<Finishable>>, key: string | number) => (
    props: Finishable
) => <Paragraph texts={texts} onFinish={props.onFinish} />;

const Chapter: React.FC<ChapterProps> = React.memo(({ chapter, onNavigate }) => {
    const noop = React.useCallback(() => void 0, []);

    const processedStory = React.useMemo(() => {
        const body = chapter.body.map((line, idx) => {
            // split to get the keywords in [brackets]
            // all odd numbered indexes will be keywords
            // means that brackets are not allowed in the story
            const phrases = line.split(/[\[\]]/).map((text, i) => {
                return (i % 2 === 1 ? keyword : phrase)(text);
            })

            return paragraph(phrases, idx);
        });

        return paragraph(body, chapter.name)({ onFinish: noop });
    }, [chapter, noop])

    return <>
        {processedStory}
        <Prompt 
            chapterName={chapter.name}
            solutions={chapter.solutions} 
            onAccept={onNavigate} 
        />
    </>;
});

export default Chapter;