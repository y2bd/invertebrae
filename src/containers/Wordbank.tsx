import React from "react";
import "./Wordbank.css";
import Keyword, { KeywordDragProps } from "../text/Keyword";

import { __EXPERIMENTAL_DND_HOOKS_THAT_MAY_CHANGE_AND_BREAK_MY_BUILD__ as dnd } from "react-dnd";

// state

type State = typeof initialState;
const initialState = {
  words: ["set", "close"] as string[]
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
interface WordbankProps { }

const Wordbank: React.FC<WordbankProps> = React.memo(() => {
  const uselessOnFinish = React.useCallback(() => void 0, []);
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const [collectionProps, dropRef] = dnd.useDrop<
    KeywordDragProps,
    { target: "wordbank" },
    { hovering: boolean, canDrop: boolean }
  >({
    accept: "keyword",
    canDrop: item => {
      return item.source !== "wordbank";
    },
    collect: monitor => ({
      canDrop: monitor.canDrop(),
      hovering: monitor.isOver()
    }),
    drop: item => {
      // TODO don't allow if keyword has been consumed
      dispatch({ type: "addWord", word: item.id });
      return { target: "wordbank" };
    }
  });

  const onConsumed = React.useCallback(
    (word: string) => dispatch({ type: "removeWord", word }),
    [dispatch]
  );

  return (
    <div
      className={"Wordbank" + (collectionProps.hovering && collectionProps.canDrop ? " hovering" : "")}
      ref={dropRef}
    >
      {state.words.map(word => (
        <Keyword
          key={word}
          text={word}
          location={"wordbank"}
          onFinish={uselessOnFinish}
          onConsumed={onConsumed}
        />
      ))}
    </div>
  );
});

export default Wordbank;
