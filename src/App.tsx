import React from "react";
import "./App.css";
import Chapter from "./Chapter";
import Frame from "./containers/Frame";
import Wordbank from "./containers/Wordbank";
import { loadStory } from "./Story";

const story = loadStory();

interface ChapterNode {
  readonly chapterName: string;
  readonly beforeName: string | null;
}

interface ChapterGraph {
  [chapterName: string]: ChapterNode;
}

const App: React.FC = () => {
  const [chapterGraph, setChapterGraph] = React.useState<ChapterGraph>({
    [story.start]: {
      chapterName: story.start,
      beforeName: null
    },
  })

  const [chapterPointer, setChapterPointer] = React.useState(story.start);

  const [showHelp, setShowHelp] = React.useState(false);

  const currentChapter = chapterGraph[chapterPointer];
  const canGoBefore = currentChapter.beforeName !== null;

  const pushNewChapter = React.useCallback((chapterName: string) => {
    let nextUp = chapterGraph[chapterName];
    if (!nextUp) {
      nextUp = {
        chapterName,
        beforeName: chapterPointer
      };
    } else {
      nextUp = {
        ...nextUp,
        beforeName: chapterPointer
      };
    }

    const newChapterGraph = {
      ...chapterGraph,
      [chapterName]: nextUp
    };

    setChapterGraph(newChapterGraph);
    setChapterPointer(chapterName);
  }, [chapterPointer, setChapterPointer, chapterGraph, setChapterGraph]);

  const goBefore = React.useCallback(() => {
    if (!canGoBefore) {
      return;
    }

    setChapterPointer(currentChapter.beforeName!);
  }, [canGoBefore, currentChapter, setChapterPointer])

  const onHelp = React.useCallback(() => {
    setShowHelp(true);
  }, [setShowHelp]);

  const onCloseHelp = React.useCallback(() => {
    setShowHelp(false);
  }, [setShowHelp]);

  return (
    <div className="App">
      <Frame>
        <div className="Navigation">
          <span 
            className={"Before" + (canGoBefore ? " activated" : "")}
            onClick={goBefore}
          >
            {"< BEFORE"}
          </span>
          <span
            className={"HelpButton"}
            onClick={onHelp}
          >
            {"?"}
          </span>
        </div>
        { /* We render all chapters in queue to keep them in memory */ }
        {(Object.keys(chapterGraph).map(chapterName => (
          <div key={chapterName} style={{ 
            display: chapterName === currentChapter.chapterName ? "flex" : "none",
            flexDirection: "column",
            height: "100%", 
          }}>
            <Chapter 
              key={chapterName}
              chapter={story.chapters[chapterName]} 
              onNavigate={pushNewChapter}
            />
          </div>
        )))}
        {showHelp && (<div className="Help">
          <p>welcome into <em>invertebrae</em>.</p>
          <p>while life may progress along with currency, you as an observer do not.</p>
          <p>to the right stores knowledge, and below submits answers.</p> 
          <p>the future does not cement the past.</p>
          <p>good luck.</p>
          <span 
            className="CloseHelp" 
            onClick={onCloseHelp}
          >I'LL TRY</span>
        </div>)}
      </Frame>
      <Wordbank />
    </div>
  );
};

export default App;
