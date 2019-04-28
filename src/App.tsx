import React from "react";
import "./App.css";
import Chapter from "./Chapter";
import Frame from "./containers/Frame";
import Wordbank from "./containers/Wordbank";
import { loadStory } from "./Story";

const story = loadStory();

const App: React.FC = () => {
  const [chapterQueue, setChapterQueue] = React.useState([story.start]);
  const [chapterCursor, setChapterCursor] = React.useState(0);
  const [showHelp, setShowHelp] = React.useState(false);

  const canGoBefore = chapterCursor > 0;

  const currentChapter = chapterQueue[chapterCursor];

  const pushNewChapter = React.useCallback((chapterName: string) => {
    const nextUp = chapterQueue[chapterCursor + 1];
    if (nextUp) {
      // TODO ALLOW PRESERVATION OF FUTURE
      // SCAN FORWARD
      // PERHAPS SWITCH TO LINKED LIST/MAP
      if (nextUp !== chapterName) {
        setChapterQueue(chapterQueue.slice(0, chapterCursor + 1).concat(chapterName));
      }
    } else {
      setChapterQueue(chapterQueue.concat(chapterName));
    }

    setChapterCursor(chapterCursor + 1);
  }, [chapterQueue, chapterCursor, setChapterQueue, setChapterCursor]);

  const goBefore = React.useCallback(() => {
    if (!canGoBefore) {
      return;
    }

    setChapterCursor(chapterCursor - 1);
  }, [canGoBefore, chapterCursor, setChapterCursor])

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
        {(chapterQueue.map(chapterName => (
          <div key={chapterName} style={{ 
            display: chapterName === currentChapter ? "flex" : "none",
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
