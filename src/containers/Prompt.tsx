import * as React from "react";
import "./Prompt.css";
import Keyword, { KeywordDragProps } from "../text/Keyword";

import { __EXPERIMENTAL_DND_HOOKS_THAT_MAY_CHANGE_AND_BREAK_MY_BUILD__ as dnd } from "react-dnd";
import { arrayEquals } from "../util/arrayEq";
import { Solution } from "../Story";

// state

const initialState = {};

type State = { [chapterName: string]: string[] };
type Action =
  | { type: "addWord"; chapterName: string; word: string }
  | { type: "removeWord"; chapterName: string; word: string };

function reducer(state: State, action: Action) {
  const words: string[] = state[action.chapterName] || [];

  switch (action.type) {
    case "addWord":
      return {
        ...state,
        [action.chapterName]: words.concat(action.word)
      };
    case "removeWord":
      return {
        ...state,
        // technically bug if you have two of the same word
        [action.chapterName]: words.filter(word => word !== action.word)
      };
    default:
      return state;
  }
}

// component
interface PromptProps {
  readonly chapterName: string;
  readonly solutions: Solution[];
  readonly onAccept: (nextChapterName: string) => void;
}

const Prompt: React.FC<PromptProps> = React.memo(({ chapterName, solutions, onAccept }) => {
  const uselessOnFinish = React.useCallback(() => void 0, []);
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const words = state[chapterName] || [];

  const [collectionProps, dropRef] = dnd.useDrop<
    KeywordDragProps,
    { target: "puzzle" },
    { hovering: boolean, canDrop: boolean }
  >({
    accept: "keyword",
    canDrop: item => {
      return item.source !== "puzzle";
    },
    collect: monitor => ({
      canDrop: monitor.canDrop(),
      hovering: monitor.isOver()
    }),
    drop: item => {
      dispatch({ type: "addWord", chapterName, word: item.id });
      return { target: "puzzle" };
    }
  });

  const onConsumed = React.useCallback(
    (word: string) => dispatch({ type: "removeWord", chapterName, word }),
    [chapterName, dispatch]
  );

  const solutionNextChapter = React.useMemo(
    () => {
      for (let i = 0; i < solutions.length; i++) {
        const solution = solutions[i];
        if (arrayEquals(solution.answer, words)) {
          return solution.next;
        }
      }
      return undefined;
    },
    [solutions, words]
  )

  const onAcceptIfSolved = 
    React.useCallback(
      () => solutionNextChapter && onAccept(solutionNextChapter), 
      [onAccept, solutionNextChapter]
    );

  return (
    <div
      className={"Prompt" + (collectionProps.hovering && collectionProps.canDrop ? " hovering" : "")}
      ref={dropRef}
    >
      <span className="Symbol">{">"}</span>
      {words.map(word => (
        <Keyword
          key={word}
          text={word}
          location={"puzzle"}
          onFinish={uselessOnFinish}
          onConsumed={onConsumed}
        />
      ))}
      <span 
        className={"OK" + (solutionNextChapter ? " activated" : "")}
        onClick={onAcceptIfSolved}
      >OK</span>
    </div>
  );
});

export default Prompt;
