import * as React from "react";
import "./Prompt.css";
import Keyword, { KeywordDragProps } from "../text/Keyword";

import { __EXPERIMENTAL_DND_HOOKS_THAT_MAY_CHANGE_AND_BREAK_MY_BUILD__ as dnd } from "react-dnd";

// state

type State = typeof initialState;
const initialState = {
  words: [] as string[]
};

type Action =
  | { type: "addWord"; word: string }
  | { type: "removeWord"; word: string };

function reducer(state: State, action: Action) {
  switch (action.type) {
    case "addWord":
      return {
        ...state,
        words: state.words.concat(action.word)
      };
    case "removeWord":
      return {
        ...state,
        // technically bug if you have two of the same word
        words: state.words.filter(word => word !== action.word)
      };
    default:
      return state;
  }
}

// component
interface PromptProps {}

const Prompt: React.FC<PromptProps> = React.memo(props => {
  const uselessOnFinish = React.useCallback(() => void 0, []);
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const [collectionProps, dropRef] = dnd.useDrop<
    KeywordDragProps,
    { target: "puzzle" },
    { hovering: boolean }
  >({
    accept: "keyword",
    canDrop: item => {
      return item.source !== "puzzle";
    },
    collect: monitor => ({
      hovering: monitor.isOver()
    }),
    drop: item => {
      dispatch({ type: "addWord", word: item.id });
      return { target: "puzzle" };
    }
  });

  const onConsumed = React.useCallback(
    (word: string) => dispatch({ type: "removeWord", word }),
    [dispatch]
  );

  return (
    <div
      className={"Prompt" + (collectionProps.hovering ? " hovering" : "")}
      ref={dropRef}
    >
      <span className="Symbol">{">"}</span>
      {state.words.map(word => (
        <Keyword
          key={word}
          text={word}
          location={"story"}
          onFinish={uselessOnFinish}
          onConsumed={onConsumed}
        />
      ))}
    </div>
  );
});

export default Prompt;
